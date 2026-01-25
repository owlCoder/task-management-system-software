import { Router, Request, Response } from "express";
import { ISprintService } from "../../Domain/services/ISprintService";
import { SprintCreateDTO } from "../../Domain/DTOs/SprintCreateDTO";
import { SprintUpdateDTO } from "../../Domain/DTOs/SprintUpdateDTO";
import { ReqParams } from "../../Domain/types/ReqParams";


export class SprintController {
    private readonly router: Router;

    constructor(private readonly sprintService: ISprintService) {
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
        try {
            const projectId = parseInt(req.params.projectId, 10);
            if (isNaN(projectId)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const body = req.body as Omit<SprintCreateDTO, "project_id">;
            const dto: SprintCreateDTO = {
                project_id: projectId,
                ...body,
                story_points: (body as any).story_points ?? 0,
            };

            const created = await this.sprintService.createSprint(dto);
            if (created.success) {
                res.status(201).json(created.data);
            } else {
                res.status(created.code).json({ message: created.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getSprintsByProject(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        try {
            const projectId = parseInt(req.params.projectId, 10);
            if (isNaN(projectId)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const list = await this.sprintService.getSprintsByProject(projectId);
            if (list.success) {
                res.status(200).json(list.data);
            } else {
                res.status(list.code).json({ message: list.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getSprintById(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            const sprint = await this.sprintService.getSprintById(sprintId);
            if (sprint.success) {
                res.status(200).json(sprint.data);
            } else {
                res.status(sprint.code).json({ message: sprint.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async updateSprint(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            const data = req.body as SprintUpdateDTO;
            const updated = await this.sprintService.updateSprint(sprintId, data);
            if (updated.success) {
                res.status(200).json(updated.data);
            } else {
                res.status(updated.code).json({ message: updated.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteSprint(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            const ok = await this.sprintService.deleteSprint(sprintId);
            if (ok.success) {
                res.status(204).send();
            } else {
                res.status(ok.code).json({ message: ok.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}