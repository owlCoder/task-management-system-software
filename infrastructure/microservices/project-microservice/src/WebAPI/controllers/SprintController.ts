import { Router, Request, Response } from "express";
import { ISprintService } from "../../Domain/services/ISprintService";
import { SprintCreateDTO } from "../../Domain/DTOs/SprintCreateDTO";
import { SprintUpdateDTO } from "../../Domain/DTOs/SprintUpdateDTO";
import { ReqParams } from "../../Domain/types/ReqParams";
import { ILogerService } from "../../Domain/services/ILogerService";


export class SprintController {
    private readonly router: Router;

    constructor(
        private readonly sprintService: ISprintService,
        private readonly logger: ILogerService) {
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

            this.logger.log(`Creating sprint for project ID ${projectId} with data: ${JSON.stringify(dto)}`);

            const created = await this.sprintService.createSprint(dto);
            if (created.success) {
                this.logger.log(`Sprint created successfully with ID ${created.data.sprint_id} for project ID ${projectId}`);
                res.status(201).json(created.data);
            } else {
                this.logger.log(`Failed to create sprint: ${created.error}`);
                res.status(created.code).json({ message: created.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
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

            this.logger.log(`Fetching sprints for project ID ${projectId}`);

            const list = await this.sprintService.getSprintsByProject(projectId);
            if (list.success) {
                this.logger.log(`Fetched ${list.data.length} sprints for project ID ${projectId}`);
                res.status(200).json(list.data);
            } else {
                this.logger.log(`Failed to fetch sprints: ${list.error}`);
                res.status(list.code).json({ message: list.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
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

            this.logger.log(`Fetching sprint by ID ${sprintId}`);

            const sprint = await this.sprintService.getSprintById(sprintId);
            if (sprint.success) {
                this.logger.log(`Sprint fetched successfully: ID ${sprintId}`);
                res.status(200).json(sprint.data);
            } else {
                this.logger.log(`Failed to fetch sprint: ${sprint.error}`);
                res.status(sprint.code).json({ message: sprint.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
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

            this.logger.log(`Updating sprint ID ${sprintId} with data: ${JSON.stringify(data)}`);

            const updated = await this.sprintService.updateSprint(sprintId, data);
            if (updated.success) {
                this.logger.log(`Sprint ID ${sprintId} updated successfully`);
                res.status(200).json(updated.data);
            } else {
                this.logger.log(`Failed to update sprint: ${updated.error}`);
                res.status(updated.code).json({ message: updated.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
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

            this.logger.log(`Deleting sprint ID ${sprintId}`);

            const ok = await this.sprintService.deleteSprint(sprintId);
            if (ok.success) {
                this.logger.log(`Sprint ID ${sprintId} deleted successfully`);
                res.status(204).send();
            } else {
                this.logger.log(`Failed to delete sprint: ${ok.error}`);
                res.status(ok.code).json({ message: ok.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}