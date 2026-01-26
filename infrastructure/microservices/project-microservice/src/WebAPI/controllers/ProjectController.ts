import { Router, Request, Response } from "express";
import multer from "multer";
import { IProjectService } from "../../Domain/services/IProjectService";
import { IProjectUserService } from "../../Domain/services/IProjectUserService";
import { ProjectCreateDTO } from "../../Domain/DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/ProjectUpdateDTO";
import { ProjectStatus } from "../../Domain/enums/ProjectStatus";
import { validateCreateProject, validateUpdateProject } from "../validators/ProjectValidator";
import { IR2StorageService } from "../../Storage/R2StorageService";
import { ReqParams } from "../../Domain/types/ReqParams";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

export class ProjectController {
    private readonly router: Router;

    constructor(
        private readonly projectService: IProjectService,
        private readonly storageService: IR2StorageService,
        private readonly projectUserService: IProjectUserService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/projects", this.getProjects.bind(this));
        this.router.get("/project-ids", this.getProjectIds.bind(this));
        this.router.get("/users/:userId/projects", this.getProjectsByUserId.bind(this));
        this.router.get("/projects/:id", this.getProjectById.bind(this));
        this.router.post("/projects", upload.single("image_file"), this.createProject.bind(this));
        this.router.put("/projects/:id", upload.single("image_file"), this.updateProject.bind(this));
        this.router.delete("/projects/:id", this.deleteProject.bind(this));
        this.router.get("/projects/:id/exists", this.projectExists.bind(this));
    }

    private async getProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await this.projectService.getProjects();
            if (projects.success) {
                res.status(200).json(projects.data);
            } else {
                res.status(projects.code).json({ message: projects.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectIds(req: Request, res: Response): Promise<void> {
        try {
            const projectIds = await this.projectService.getProjectIds();
            if (projectIds.success) {
                res.status(200).json(projectIds.data);
            } else {
                res.status(projectIds.code).json({ message: projectIds.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectsByUserId(req: Request<ReqParams<'userId'>>, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            const projects = await this.projectService.getProjectsByUserId(userId);
            if (projects.success) {
                res.status(200).json(projects.data);
            } else {
                res.status(projects.code).json({ message: projects.error });
            }

        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectById(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const project = await this.projectService.getProjectById(id);
            if (project.success) {
                res.status(200).json(project.data);
            } else {
                res.status(project.code).json({ message: project.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private parseStatus(statusStr: string | undefined): ProjectStatus {
        if (!statusStr) return ProjectStatus.NOT_STARTED;

        const statusMap: { [key: string]: ProjectStatus } = {
            "Active": ProjectStatus.ACTIVE,
            "Paused": ProjectStatus.PAUSED,
            "Completed": ProjectStatus.COMPLETED,
            "Not Started": ProjectStatus.NOT_STARTED,
        };

        return statusMap[statusStr] || ProjectStatus.NOT_STARTED;
    }

    private async createProject(req: Request, res: Response): Promise<void> {
        try {
            const creatorUsername = req.body.creator_username?.trim();
            const totalWeeklyHours = parseInt(req.body.total_weekly_hours_required, 10);

            const data: ProjectCreateDTO = {
                project_name: req.body.project_name,
                project_description: req.body.project_description || "",
                total_weekly_hours_required: totalWeeklyHours,
                allowed_budget: parseFloat(req.body.allowed_budget),
                creator_username: creatorUsername,
                start_date: req.body.start_date || null,
                sprint_count: parseInt(req.body.sprint_count, 10),
                sprint_duration: parseInt(req.body.sprint_duration, 10),
                status: this.parseStatus(req.body.status),
            };

            if (req.file) {
                const uploadResult = await this.storageService.uploadImage(
                    req.file.buffer,
                    req.file.originalname,
                    req.file.mimetype
                );
                data.image_key = uploadResult.key;
                data.image_url = uploadResult.url;
            }

            const validation = validateCreateProject(data);
            if (!validation.success) {
                if (data.image_key) {
                    await this.storageService.deleteImage(data.image_key);
                }
                res.status(400).json({ message: validation.message });
                return;
            }

            const createdResult = await this.projectService.CreateProject(data);

            if (!createdResult.success) {
                if (data.image_key) {
                    await this.storageService.deleteImage(data.image_key);
                }
                res.status(createdResult.code).json({ message: createdResult.error });
                return;
            }

            const created = createdResult.data;

            if (creatorUsername && created.project_id) {
                try {
                    await this.projectUserService.assignUserToProject({
                        project_id: created.project_id,
                        username: creatorUsername,
                        weekly_hours: 0,
                    });
                    console.log(
                        `Project Manager "${creatorUsername}" automatically assigned to project ${created.project_id} with 0 weekly hours`
                    );
                } catch (assignError) {
                    console.error(
                        "Failed to auto-assign Project Manager to project:",
                        assignError
                    );
                }
            }

            res.status(201).json(created);
        } catch (err) {
            console.error("Create project error:", err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async updateProject(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const data: ProjectUpdateDTO = {};

            if (req.body.project_name !== undefined) {
                data.project_name = req.body.project_name;
            }
            if (req.body.project_description !== undefined) {
                data.project_description = req.body.project_description;
            }
            if (req.body.total_weekly_hours_required !== undefined) {
                data.total_weekly_hours_required = parseInt(req.body.total_weekly_hours_required, 10);
            }
            if (req.body.allowed_budget !== undefined) {
                data.allowed_budget = parseFloat(req.body.allowed_budget);
            }
            if (req.body.start_date !== undefined) {
                data.start_date = req.body.start_date || null;
            }
            if (req.body.sprint_count !== undefined) {
                data.sprint_count = parseInt(req.body.sprint_count, 10);
            }
            if (req.body.sprint_duration !== undefined) {
                data.sprint_duration = parseInt(req.body.sprint_duration, 10);
            }
            if (req.body.status !== undefined) {
                data.status = this.parseStatus(req.body.status);
            }

            if (req.file) {
                const uploadResult = await this.storageService.uploadImage(
                    req.file.buffer,
                    req.file.originalname,
                    req.file.mimetype
                );
                data.image_key = uploadResult.key;
                data.image_url = uploadResult.url;
            }

            const validation = validateUpdateProject(data);
            if (!validation.success) {
                if (data.image_key) {
                    await this.storageService.deleteImage(data.image_key);
                }
                res.status(400).json({ message: validation.message });
                return;
            }

            const updated = await this.projectService.updateProject(id, data);
            if (updated.success) {
                res.status(200).json(updated.data);
            } else {
                if (data.image_key) {
                    await this.storageService.deleteImage(data.image_key);
                }
                res.status(updated.code).json({ message: updated.error });
            }
        } catch (err) {
            console.error("Update project error:", err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteProject(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const ok = await this.projectService.deleteProject(id);
            if (ok.success) {
                res.status(204).send();
            } else {
                res.status(ok.code).json({ message: ok.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async projectExists(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const exists = await this.projectService.projectExists(id);
            if (exists.success) {
                res.status(200).json({ exists: exists.data });
            } else {
                res.status(exists.code).json({ message: exists.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}