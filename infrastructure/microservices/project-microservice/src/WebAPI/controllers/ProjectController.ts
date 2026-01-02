import { Router, Request, Response } from "express";
import multer from "multer";
import { IProjectService } from "../../Domain/services/IProjectService";
import { ProjectCreateDTO } from "../../Domain/DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/ProjectUpdateDTO";
import { validateCreateProject, validateUpdateProject } from "../validators/ProjectValidator";
import { IR2StorageService } from "../../Storage/R2StorageService";

// Koristi memory storage umesto disk storage
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
        private readonly storageService: IR2StorageService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/projects", this.getProjects.bind(this));
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
            res.status(200).json(projects);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            const projects = await this.projectService.getProjectsByUserId(userId);
            res.status(200).json(projects);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }
            const project = await this.projectService.getProjectById(id);
            res.status(200).json(project);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async createProject(req: Request, res: Response): Promise<void> {
        try {
            const data: ProjectCreateDTO = {
                project_name: req.body.project_name,
                project_description: req.body.project_description || "",
                total_weekly_hours_required: parseInt(req.body.total_weekly_hours_required, 10),
                allowed_budget: parseFloat(req.body.allowed_budget),
            };

            // Ako je uploadovana slika, sačuvaj je na R2
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
                // Ako validacija ne prođe, obriši uploadovanu sliku
                if (data.image_key) {
                    await this.storageService.deleteImage(data.image_key);
                }
                res.status(400).json({ message: validation.message });
                return;
            }

            const created = await this.projectService.CreateProject(data);
            res.status(201).json(created);
        } catch (err) {
            console.error("Create project error:", err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async updateProject(req: Request, res: Response): Promise<void> {
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

            // Ako je uploadovana nova slika
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
                // Ako validacija ne prođe, obriši novu uploadovanu sliku
                if (data.image_key) {
                    await this.storageService.deleteImage(data.image_key);
                }
                res.status(400).json({ message: validation.message });
                return;
            }

            const updated = await this.projectService.updateProject(id, data);
            res.status(200).json(updated);
        } catch (err) {
            console.error("Update project error:", err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const ok = await this.projectService.deleteProject(id);
            if (!ok) {
                res.status(404).json({ message: `Project with id ${id} not found` });
                return;
            }
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async projectExists(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const exists = await this.projectService.projectExists(id);
            res.status(200).json({ exists });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}