import { Router, Request, Response } from "express";
import { ISprintService } from "../../Domain/services/ISprintService";
import { SprintCreateDTO } from "../../Domain/DTOs/SprintCreateDTO";
import { SprintUpdateDTO } from "../../Domain/DTOs/SprintUpdateDTO";
import { ReqParams } from "../../Domain/types/ReqParams";


export class SprintController {
    private readonly router: Router;

    constructor (private readonly sprintService: ISprintService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/projects/:projectId/sprints", this.createSprint.bind(this));
        this.router.get("/projects/:projectId/sprints", this.getSprintsByProject.bind(this));
        this.router.get("/sprints/:id", this.getSprintById.bind(this));
        this.router.put("/sprints/:id", this.updateSprint.bind(this));
        this.router.delete("/sprints/:id", this.deleteSprint.bind(this));
    }

    private async createSprint(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        try{
            const projectId = parseInt(req.params.projectId, 10);
            if(isNaN(projectId)){
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const body = req.body as Omit<SprintCreateDTO, "project_id">;
            const dto: SprintCreateDTO = {
                project_id: projectId,
                ...body
            };
            const created = await this.sprintService.createSprint(dto);
            res.status(201).json(created);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getSprintsByProject(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        try {
            const projectId = parseInt(req.params.projectId, 10);
            if(isNaN(projectId)){
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }
            const list = await this.sprintService.getSprintsByProject(projectId);
            res.status(200).json(list);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getSprintById(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if(isNaN(sprintId)){
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }
            const sprint = await this.sprintService.getSprintById(sprintId);
            res.status(200).json(sprint);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async updateSprint(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if(isNaN(sprintId)){
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }
            const data = req.body as SprintUpdateDTO;
            const updated = await this.sprintService.updateSprint(sprintId, data);
            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteSprint(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if(isNaN(sprintId)){
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }
            const ok = await this.sprintService.deleteSprint(sprintId);
            if(!ok){
                res.status(404).json({ message: "Sprint not found" });
                return;
            }
            res.status(204).send();
        }catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}