import { Router, Request, Response } from "express";
import multer from "multer";
// npm install multer
// npm install --save-dev @types/multer
import { IProjectService } from "../../Domain/services/IProjectService";
import { ProjectCreateDTO } from "../../Domain/DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/ProjectUpdateDTO";
import { validateCreateProject, validateUpdateProject } from "../validators/ProjectValidator";

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export class ProjectController {
    private readonly router: Router;

    constructor(private readonly projectService: IProjectService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/projects", this.getProjects.bind(this));
        this.router.get("/users/:userId/projects", this.getProjectsByUserId.bind(this));
        this.router.get("/projects/:id", this.getProjectById.bind(this));
        this.router.post("/projects", upload.single('image_file'), this.createProject.bind(this));
        this.router.put("/projects/:id", upload.single('image_file'), this.updateProject.bind(this));
        this.router.delete("/projects/:id", this.deleteProject.bind(this));
        this.router.get("/projects/:id/exists", this.projectExists.bind(this));
    }

    private async getProjects(req: Request, res: Response) : Promise<void> {
        try{
            const projects = await this.projectService.getProjects();
            res.status(200).json(projects);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId, 10);
            if(isNaN(userId)) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            const projects = await this.projectService.getProjectsByUserId(userId);
            res.status(200).json(projects);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectById(req: Request, res: Response) : Promise<void> {
        try{
            const id = parseInt(req.params.id, 10);
            if(isNaN(id)){
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }
            const project = await this.projectService.getProjectById(id);
            res.status(200).json(project);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async createProject(req: Request, res: Response) : Promise<void> {
        try{
            // Parsiraj podatke iz form-data
            const data: ProjectCreateDTO = {
                project_name: req.body.project_name,
                project_description: req.body.project_description || '',
                image_file_uuid: '', // Defaultna vrednost
                total_weekly_hours_required: parseInt(req.body.total_weekly_hours_required, 10),
                allowed_budget: parseFloat(req.body.allowed_budget),
            };

            if (req.file) {
                const base64Image = req.file.buffer.toString('base64');
                const mimeType = req.file.mimetype;
                data.image_file_uuid = `data:${mimeType};base64,${base64Image}`;
            }

            const validation = validateCreateProject(data);
            if(!validation.success){
                res.status(400).json({ message: validation.message });
                return;
            }

            const created = await this.projectService.CreateProject(data);
            res.status(201).json(created);
        } catch (err) {
            console.error('Create project error:', err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async updateProject (req: Request, res: Response) : Promise<void> {
        try{
            const id = parseInt(req.params.id, 10);
            if(isNaN(id)){
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

            if (req.file) {
                const base64Image = req.file.buffer.toString('base64');
                const mimeType = req.file.mimetype;
                data.image_file_uuid = `data:${mimeType};base64,${base64Image}`;
            }

            const validation = validateUpdateProject(data);
            if(!validation.success){
                res.status(400).json({ message: validation.message });
                return;
            }

            const updated = await this.projectService.updateProject(id, data);
            res.status(200).json(updated);
        } catch (err) {
            console.error('Update project error:', err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteProject(req: Request, res: Response) : Promise<void> {
        try{
            const id = parseInt(req.params.id, 10);
            if(isNaN(id)){
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }
            const ok = await this.projectService.deleteProject(id);
            if(!ok){
                res.status(404).json({ message: `Project with id ${id} not found` });
                return;
            }
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async projectExists(req: Request, res: Response) : Promise<void> {
        try{
            const id = parseInt(req.params.id, 10);
            if(isNaN(id)){
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const exists = await this.projectService.projectExists(id);
            res.status(200).json({ exists });
        }catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}