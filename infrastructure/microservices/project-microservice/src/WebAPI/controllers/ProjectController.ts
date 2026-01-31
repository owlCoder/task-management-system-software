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
import { ILogerService } from "../../Domain/services/ILogerService";
import { ISIEMService } from "../../Siem/Domain/Services/ISIEMService";
import { sendSiemEvent } from "../../Utils/WebAPI/SIEMFilter";
import { checkProjectManagerPermission } from "../../Utils/WebAPI/checkProjectManagerPermission";

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
        private readonly projectUserService: IProjectUserService,
        private readonly logger: ILogerService,
        private readonly siemService: ISIEMService,
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

    /**
     * GET /api/v1/projects
     * Get all projects
     * @returns {ProjectDTO[]} - JSON array of all projects
     * @see {@link ProjectDTO}
     */
    private async getProjects(req: Request, res: Response): Promise<void> {
        try {
            this.logger.log("Fetching all projects");

            const projects = await this.projectService.getProjects();
            if (projects.success) {
                sendSiemEvent(this.siemService, req, 200, "Request successful | All projects fetched", false);
                res.status(200).json(projects.data);
            } else {
                this.logger.log(projects.error);
                sendSiemEvent(this.siemService, req, projects.code, projects.error, false);
                res.status(projects.code).json({ message: projects.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, false);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * GET /api/v1/project-ids
     * Get all project IDs
     * @returns {number[]} - Array of project IDs
     */
    private async getProjectIds(req: Request, res: Response): Promise<void> {
        try {
            this.logger.log("Fetching all project IDs");

            const projectIds = await this.projectService.getProjectIds();
            if (projectIds.success) {
                sendSiemEvent(this.siemService, req, 200, "Request successful | Project IDs fetched", false);
                res.status(200).json(projectIds.data);
            } else {
                this.logger.log(projectIds.error);
                sendSiemEvent(this.siemService, req, projectIds.code, projectIds.error, false);
                res.status(projectIds.code).json({ message: projectIds.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, false);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * GET /api/v1/users/:userId/projects
     * Get all projects assigned to a specific user
     * @param {userId} req.params - ID of the user
     * @returns {ProjectDTO[]} - JSON array of projects
     * @see {@link ProjectDTO}
     */
    private async getProjectsByUserId(req: Request<ReqParams<'userId'>>, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid user ID", false);
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            this.logger.log(`Fetching projects for user ID ${userId}`);
            const projects = await this.projectService.getProjectsByUserId(userId);
            if (projects.success) {
                sendSiemEvent(this.siemService, req, 200, `Projects fetched for user ID ${userId}`, false);
                res.status(200).json(projects.data);
            } else {
                this.logger.log(projects.error);
                sendSiemEvent(this.siemService, req, projects.code, projects.error, false);
                res.status(projects.code).json({ message: projects.error });
            }

        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, false);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * GET /api/v1/projects/:id
     * Get project by ID
     * @param {id} req.params - Project ID
     * @returns {ProjectDTO} - Project data
     * @see {@link ProjectDTO}
     */
    private async getProjectById(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID", false);
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            this.logger.log(`Fetching project with ID ${id}`);
            const project = await this.projectService.getProjectById(id);
            if (project.success) {
                sendSiemEvent(this.siemService, req, 200, `Project fetched with ID ${id}`, false);
                res.status(200).json(project.data);
            } else {
                this.logger.log(project.error);
                sendSiemEvent(this.siemService, req, project.code, project.error, false);
                res.status(project.code).json({ message: project.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, false);
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

    /**
     * POST /api/v1/projects
     * Create new project
     * @param {ProjectCreateDTO} req.body - Project creation data
     * @returns {ProjectDTO} - Created project
     * @see {@link ProjectCreateDTO}
     * @see {@link ProjectDTO}
     */
    private async createProject(req: Request, res: Response): Promise<void> {
        try {
            this.logger.log("Creating new project");

            const creatorUsername = req.body.creator_username?.trim();
            const totalWeeklyHours = parseInt(req.body.total_weekly_hours_required, 10);

            const data: ProjectCreateDTO = {
                project_name: req.body.project_name,
                project_description: req.body.project_description || "",
                total_weekly_hours_required: totalWeeklyHours,
                allowed_budget: parseFloat(req.body.allowed_budget),
                creator_username: creatorUsername,
                start_date: req.body.start_date || null,
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
                this.logger.log(validation.message!);
                sendSiemEvent(this.siemService, req, 400, validation.message!, true);
                res.status(400).json({ message: validation.message });
                return;
            }

            const createdResult = await this.projectService.CreateProject(data);

            if (!createdResult.success) {
                if (data.image_key) {
                    await this.storageService.deleteImage(data.image_key);
                }
                this.logger.log(createdResult.error);
                sendSiemEvent(this.siemService, req, createdResult.code, createdResult.error, true);
                res.status(createdResult.code).json({ message: createdResult.error });
                return;
            }

            this.logger.log(`Project created: ${createdResult.data.project_id}`);

            sendSiemEvent(
                this.siemService,
                req,
                201,
                "Request successful | New project created",
                true
            );

            const created = createdResult.data;

            if (creatorUsername && created.project_id) {
                try {
                    await this.projectUserService.assignUserToProject({
                        project_id: created.project_id,
                        username: creatorUsername,
                        weekly_hours: 0,
                    });
                    this.logger.log(
                        `Project Manager "${creatorUsername}" auto-assigned to project ${created.project_id}`
                    );
                } catch (assignError) {
                    this.logger.log(
                        `Failed to auto-assign Project Manager: ${(assignError as Error).message}`
                    );
                }
            }

            res.status(201).json(created);
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, true);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * PUT /api/v1/projects/:id
     * Update existing project
     * @param {id and ProjectUpdateDTO} req.params & req.body - Project ID and updated data
     * @returns {ProjectDTO} - Updated project
     * @see {@link ProjectUpdateDTO}
     * @see {@link ProjectDTO}
     */
    private async updateProject(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        console.log("HEADERS IN PROJECT MS /updateProject:", req.headers);
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID", true);
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            // Check permissions for Project Manager

            const hasPermission = await checkProjectManagerPermission(req, this.projectUserService, id);
            if(!hasPermission) {
                sendSiemEvent(
                    this.siemService,
                    req,
                    403,
                    `Forbidden | Project Manager has no access to project ${id}`,
                    true
                );
                res.status(403).json({ message: "Forbidden: You don't have permission to modify this project" });
                return;
            }

            this.logger.log(`Updating project with ID ${id}`);

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
                this.logger.log(validation.message!);
                sendSiemEvent(this.siemService, req, 400, validation.message!, true);
                res.status(400).json({ message: validation.message });
                return;
            }

            const updated = await this.projectService.updateProject(id, data);
            if (updated.success) {
                sendSiemEvent(
                    this.siemService,
                    req,
                    200,
                    `Request successful | Project updated with ID ${id}`,
                    true
                );
                res.status(200).json(updated.data);
            } else {
                if (data.image_key) {
                    await this.storageService.deleteImage(data.image_key);
                }
                this.logger.log(updated.error);
                sendSiemEvent(this.siemService, req, updated.code, updated.error, true);
                res.status(updated.code).json({ message: updated.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, true);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * DELETE /api/v1/projects/:id
     * Delete project by ID
     * @param {id} req.params - Project ID
     * @returns {void}
     */
    private async deleteProject(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID", true);
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            // Check permissions for Project Manager
            const hasPermission = await checkProjectManagerPermission(req, this.projectUserService, id);
            if(!hasPermission) {
                sendSiemEvent(
                    this.siemService,
                    req,
                    403,
                    `Forbidden | Project Manager has no access to project ${id}`,
                    true
                );
                res.status(403).json({ message: "Forbidden: You don't have permission to delete this project" });
                return;
            }

            this.logger.log(`Deleting project with ID ${id}`);

            const ok = await this.projectService.deleteProject(id);
            if (ok.success) {
                sendSiemEvent(
                    this.siemService,
                    req,
                    204,
                    `Request successful | Project deleted with ID ${id}`,
                    true
                );
                res.status(204).send();
            } else {
                this.logger.log(ok.error);
                sendSiemEvent(this.siemService, req, ok.code, ok.error, true);
                res.status(ok.code).json({ message: ok.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, true);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * GET /api/v1/projects/:id/exists
     * Check if project exists
     * @param {id} req.params - Project ID
     * @returns {{ exists: boolean }} - Existence flag
     */
    private async projectExists(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID", false);
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            this.logger.log(`Checking if project exists with ID ${id}`);

            const exists = await this.projectService.projectExists(id);
            if (exists.success) {
                sendSiemEvent(
                    this.siemService,
                    req,
                    200,
                    `Project existence check successful for ID ${id}`,
                    false
                );
                res.status(200).json({ exists: exists.data });
            } else {
                this.logger.log(exists.error);
                sendSiemEvent(this.siemService, req, exists.code, exists.error, false);
                res.status(exists.code).json({ message: exists.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, false);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}