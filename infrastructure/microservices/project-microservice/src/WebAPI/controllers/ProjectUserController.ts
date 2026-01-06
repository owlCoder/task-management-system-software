import { Router, Request, Response } from "express";
import { IProjectUserService } from "../../Domain/services/IProjectUserService";
import { ProjectUserAssignDTO } from "../../Domain/DTOs/ProjectUserAssignDTO";
import { validateAssignUser } from "../validators/ProjectUserValidator";


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
        this.router.get("/users/:userId/available-hours", this.getAvailableHours.bind(this));
    }


    private async assignUser(req: Request, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            const user_id = parseInt(req.body.user_id, 10);
            const weekly_hours = parseInt(req.body.weekly_hours, 10);

            const dto: ProjectUserAssignDTO = { project_id, user_id, weekly_hours };

            const validation = validateAssignUser(dto);
            if (!validation.success) {
            res.status(400).json({ message: validation.message });
            return;
            }

            const result = await this.projectUserService.assignUserToProject(dto);
            res.status(201).json(result);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getUsersForProject(req: Request, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            if(isNaN(project_id)){
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }
            const list = await this.projectUserService.getUsersForProject(project_id);
            res.status(200).json(list);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async removeUser(req: Request, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            const user_id = parseInt(req.params.userId, 10);
            
            if(isNaN(project_id) || isNaN(user_id)){
                res.status(400).json({ message: "Invalid project ID or user ID" });
                return;
            }
            const ok = await this.projectUserService.removeUserFromProject(project_id, user_id);
            if(!ok){
                res.status(404).json({ message: "Assignment not found" });
                return;
            }
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getAvailableHours(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId) || userId <= 0) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            const availableHours = await this.projectUserService.getUserAvailableHours(userId);
            res.status(200).json({ 
                user_id: userId, 
                available_hours: availableHours 
            });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}