import { Router, Request, Response } from "express";
import { IProjectUserService } from "../../Domain/services/IProjectUserService";
import { ProjectUserAssignDTO } from "../../Domain/DTOs/ProjectUserAssignDTO";
import { validateAssignUser } from "../validators/ProjectUserValidator";
import { ReqParams } from "../../Domain/types/ReqParams";

export class ProjectUserController {
    private readonly router: Router;

    constructor(private readonly projectUserService: IProjectUserService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/projects/:id/users", this.assignUser.bind(this));
        this.router.get("/projects/:id/users", this.getUsersForProject.bind(this));
        this.router.delete("/projects/:id/users/:userId", this.removeUser.bind(this));
    }

    private async assignUser(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            const username = req.body.username?.trim();
            const weekly_hours = parseInt(req.body.weekly_hours, 10);

            if (isNaN(project_id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const dto: ProjectUserAssignDTO = { project_id, username, weekly_hours };

            const validation = validateAssignUser(dto);
            if (!validation.success) {
                res.status(400).json({ message: validation.message });
                return;
            }

            const result = await this.projectUserService.assignUserToProject(dto);
            if (result.success) {
                res.status(201).json(result.data);
            } else {
                res.status(result.code).json({ message: result.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getUsersForProject(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            if (isNaN(project_id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const list = await this.projectUserService.getUsersForProject(project_id);
            if (list.success) {
                res.status(200).json(list.data);
            } else {
                res.status(list.code).json({ message: list.error });
            }
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async removeUser(req: Request<ReqParams<'id' | 'userId'>>, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            const user_id = parseInt(req.params.userId, 10);

            if (isNaN(project_id) || isNaN(user_id)) {
                res.status(400).json({ message: "Invalid project ID or user ID" });
                return;
            }

            const ok = await this.projectUserService.removeUserFromProject(project_id, user_id);
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