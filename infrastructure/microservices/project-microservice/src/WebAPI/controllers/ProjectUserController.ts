import { Router, Request, Response } from "express";
import { IProjectUserService } from "../../Domain/services/IProjectUserService";
import { ProjectUserAssignDTO } from "../../Domain/DTOs/ProjectUserAssignDTO";
import { validateAssignUser } from "../validators/ProjectUserValidator";
import { ReqParams } from "../../Domain/types/ReqParams";
import { ILogerService } from "../../Domain/services/ILogerService";
import { ISIEMService } from "../../Siem/Domain/Services/ISIEMService";
import { generateEvent } from "../../Siem/Domain/Helpers/Generate/GenerateEvent";

export class ProjectUserController {
    private readonly router: Router;

    constructor(
        private readonly projectUserService: IProjectUserService, 
        private readonly logger: ILogerService,
        private readonly siemService: ISIEMService ) {

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
                this.siemService.sendEvent(
                    generateEvent("project-microservice", req, 400, "Invalid project ID")
                );
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const dto: ProjectUserAssignDTO = { project_id, username, weekly_hours };

            this.logger.log(`Assigning user "${username}" to project ID ${project_id} with ${weekly_hours} weekly hours`);

            const validation = validateAssignUser(dto);
            if (!validation.success) {
                this.logger.log(`Validation failed: ${validation.message}`);
                this.siemService.sendEvent(
                    generateEvent("project-microservice", req, 400, validation.message!)
                );
                res.status(400).json({ message: validation.message });
                return;
            }

            const result = await this.projectUserService.assignUserToProject(dto);
            if (result.success) {
                this.logger.log(`User "${username}" assigned successfully to project ID ${project_id}`);
                this.siemService.sendEvent(
                    generateEvent(
                        "project-microservice",
                        req,
                        201,
                        `Request successful | User "${username}" assigned to project ID ${project_id}`
                    )
                );
                res.status(201).json(result.data);
            } else {
                this.logger.log(`Failed to assign user: ${result.error}`);
                this.siemService.sendEvent(
                    generateEvent("project-microservice", req, result.code, result.error)
                );
                res.status(result.code).json({ message: result.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            this.siemService.sendEvent(
                generateEvent("project-microservice", req, 500, (err as Error).message)
            );
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getUsersForProject(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            if (isNaN(project_id)) {
                this.siemService.sendEvent(
                    generateEvent("project-microservice", req, 400, "Invalid project ID")
                );
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            this.logger.log(`Fetching users for project ID ${project_id}`);

            const list = await this.projectUserService.getUsersForProject(project_id);
            if (list.success) {
                this.logger.log(`Fetched ${list.data.length} users for project ID ${project_id}`);
                this.siemService.sendEvent(
                    generateEvent(
                        "project-microservice",
                        req,
                        200,
                        `Request successful | Retrieved users for project ID ${project_id}`
                    )
                );
                res.status(200).json(list.data);
            } else {
                this.logger.log(`Failed to fetch users: ${list.error}`);
                this.siemService.sendEvent(
                    generateEvent("project-microservice", req, list.code, list.error)
                );
                res.status(list.code).json({ message: list.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            this.siemService.sendEvent(
                generateEvent("project-microservice", req, 500, (err as Error).message)
            );
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async removeUser(req: Request<ReqParams<'id' | 'userId'>>, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            const user_id = parseInt(req.params.userId, 10);

            if (isNaN(project_id) || isNaN(user_id)) {
                this.siemService.sendEvent(
                    generateEvent("project-microservice", req, 400, "Invalid project ID or user ID")
                );
                res.status(400).json({ message: "Invalid project ID or user ID" });
                return;
            }

            this.logger.log(`Removing user ID ${user_id} from project ID ${project_id}`);

            const ok = await this.projectUserService.removeUserFromProject(project_id, user_id);
            if (ok.success) {
                this.logger.log(`User ID ${user_id} removed from project ID ${project_id} successfully`);
                this.siemService.sendEvent(
                    generateEvent(
                        "project-microservice",
                        req,
                        204,
                        `Request successful | User ID ${user_id} removed from project ID ${project_id}`
                    )
                );
                res.status(204).send();
            } else {
                this.logger.log(`Failed to remove user: ${ok.error}`);
                this.siemService.sendEvent(
                    generateEvent("project-microservice", req, ok.code, ok.error)
                );
                res.status(ok.code).json({ message: ok.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            this.siemService.sendEvent(
                generateEvent("project-microservice", req, 500, (err as Error).message)
            );
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}