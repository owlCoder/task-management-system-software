import { Router, Request, Response } from "express";
import { IProjectUserService } from "../../Domain/services/IProjectUserService";
import { ProjectUserAssignDTO } from "../../Domain/DTOs/ProjectUserAssignDTO";
import { validateAssignUser } from "../validators/ProjectUserValidator";
import { ReqParams } from "../../Domain/types/ReqParams";
import { ILogerService } from "../../Domain/services/ILogerService";
import { ISIEMService } from "../../Siem/Domain/Services/ISIEMService";
import { sendSiemEvent } from "../../Utils/WebAPI/SIEMFilter";
import { send } from "process";

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

    /**
     * POST /api/v1/projects/:id/users
     * Assign user to a project
     * @param {id and ProjectUserAssignDTO} req.params & req.body - Project ID and user assignment data
     * @returns {ProjectUserDTO} - Assigned user data
     * @see {@link ProjectUserAssignDTO}
     * @see {@link ProjectUserDTO}
     */
    private async assignUser(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            const username = req.body.username?.trim();
            const weekly_hours = parseInt(req.body.weekly_hours, 10);

            if (isNaN(project_id)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID", true);
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const dto: ProjectUserAssignDTO = { project_id, username, weekly_hours };

            this.logger.log(`Assigning user "${username}" to project ID ${project_id} with ${weekly_hours} weekly hours`);

            const validation = validateAssignUser(dto);
            if (!validation.success) {
                this.logger.log(`Validation failed: ${validation.message}`);
                sendSiemEvent(this.siemService, req, 400, validation.message!, true);
                res.status(400).json({ message: validation.message });
                return;
            }

            const result = await this.projectUserService.assignUserToProject(dto);
            if (result.success) {
                this.logger.log(`User "${username}" assigned successfully to project ID ${project_id}`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    201,
                    `Request successful | User "${username}" assigned to project ID ${project_id}`,
                    true
                );
                res.status(201).json(result.data);
            } else {
                this.logger.log(`Failed to assign user: ${result.error}`);
                sendSiemEvent(this.siemService, req, result.code, result.error, true);
                res.status(result.code).json({ message: result.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, true);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * GET /api/v1/projects/:id/users
     * Get all users assigned to a project
     * @param {id} req.params - Project ID
     * @returns {ProjectUserDTO[]} - List of users assigned to the project
     * @see {@link ProjectUserDTO}
     */
    private async getUsersForProject(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            if (isNaN(project_id)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID", false);
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            this.logger.log(`Fetching users for project ID ${project_id}`);

            const list = await this.projectUserService.getUsersForProject(project_id);
            if (list.success) {
                this.logger.log(`Fetched ${list.data.length} users for project ID ${project_id}`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    200,
                    `Request successful | Retrieved users for project ID ${project_id}`,
                    false
                );
                res.status(200).json(list.data);
            } else {
                this.logger.log(`Failed to fetch users: ${list.error}`);
                sendSiemEvent(this.siemService, req, list.code, list.error, false);
                res.status(list.code).json({ message: list.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, false);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * DELETE /api/v1/projects/:id/users/:userId
     * Remove user from project
     * @param {id and userId} req.params - Project ID and User ID
     * @returns {void}
     */
    private async removeUser(req: Request<ReqParams<'id' | 'userId'>>, res: Response): Promise<void> {
        try {
            const project_id = parseInt(req.params.id, 10);
            const user_id = parseInt(req.params.userId, 10);

            if (isNaN(project_id) || isNaN(user_id)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID or user ID", true);
                res.status(400).json({ message: "Invalid project ID or user ID" });
                return;
            }

            this.logger.log(`Removing user ID ${user_id} from project ID ${project_id}`);

            const ok = await this.projectUserService.removeUserFromProject(project_id, user_id);
            if (ok.success) {
                this.logger.log(`User ID ${user_id} removed from project ID ${project_id} successfully`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    204,
                    `Request successful | User ID ${user_id} removed from project ID ${project_id}`,
                    true
                );
                res.status(204).send();
            } else {
                this.logger.log(`Failed to remove user: ${ok.error}`);
                sendSiemEvent(this.siemService, req, ok.code, ok.error, true);
                res.status(ok.code).json({ message: ok.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, true);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}