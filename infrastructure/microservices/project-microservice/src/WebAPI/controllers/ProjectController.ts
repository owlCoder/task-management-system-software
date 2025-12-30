import { Router, Request, Response } from "express";
import { IProjectService } from "../../Domain/services/IProjectService";
import { ProjectCreateDTO } from "../../Domain/DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/ProjectUpdateDTO";
import { validateCreateProject, validateUpdateProject } from "../validators/ProjectValidator";


export class ProjectController {
    private readonly router: Router;

    constructor(private readonly projectService: IProjectService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/projects", this.getProjects.bind(this));
        this.router.get("/projects/:id", this.getProjectById.bind(this));
        this.router.post("/projects", this.createProject.bind(this));
        this.router.put("/projects/:id", this.updateProject.bind(this));
        this.router.delete("/projects/:id", this.deleteProject.bind(this));
    }

    private async getProjects(req: Request, res: Response) : Promise<void> {
        try{
            const projects = await this.projectService.getProjects();
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
            const data = req.body as ProjectCreateDTO;

            const valdiation = validateCreateProject(data);
            if(!valdiation.success){
                res.status(400).json({ message: valdiation.message });
                return;
            }

            const created = await this.projectService.CreateProject(data);
            res.status(201).json(created);
        } catch (err) {
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
            const data = req.body as ProjectUpdateDTO;

            const validation = validateUpdateProject(data);
            if(!validation.success){
                res.status(400).json({ message: validation.message });
                return;
            }

            const updated = await this.projectService.updateProject(id, data);
            res.status(200).json(updated);
        } catch (err) {
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

    public getRouter(): Router {
        return this.router;
    }
}