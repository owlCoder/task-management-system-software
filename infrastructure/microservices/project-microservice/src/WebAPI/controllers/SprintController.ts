import { Router, Request, Response } from "express";
import { ISprintService } from "../../Domain/services/ISprintService";
import { SprintCreateDTO } from "../../Domain/DTOs/SprintCreateDTO";
import { SprintUpdateDTO } from "../../Domain/DTOs/SprintUpdateDTO";
import { ReqParams } from "../../Domain/types/ReqParams";
import { ILogerService } from "../../Domain/services/ILogerService";
import { ISIEMService } from "../../Siem/Domain/Services/ISIEMService";
import { sendSiemEvent } from "../../Utils/WebAPI/SIEMFilter";
import { checkProjectManagerPermission } from "../../Utils/WebAPI/checkProjectManagerPermission";
import { IProjectUserService } from "../../Domain/services/IProjectUserService";


export class SprintController {
    private readonly router: Router;

    constructor(
        private readonly sprintService: ISprintService,
        private readonly logger: ILogerService,
        private readonly siemService: ISIEMService,
        private readonly projectUserService: IProjectUserService ) {
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

    /**
     * POST /projects/:projectId/sprints
     * @param {projectId and SprintCreateDTO} req.params & req.body - Project ID and sprint data
     * @returns {SprintDTO} - JSON format return
     * @see {@link SprintCreateDTO} for input structure
     */
    private async createSprint(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        try {
            const projectId = parseInt(req.params.projectId, 10);
            if (isNaN(projectId)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID", true);
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            //Check permission for Project Manager
            const hasPermission = await checkProjectManagerPermission(
                req,
                this.projectUserService,
                projectId
            );
            if (!hasPermission) {
                this.logger.log(`Permission denied for creating sprint in project ID ${projectId}`);
                sendSiemEvent(
                    this.siemService, 
                    req, 
                    403, 
                    "Permission denied", 
                    true
                );
                res.status(403).json({ message: "Permission denied" });
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
                sendSiemEvent(
                    this.siemService,
                    req,
                    201,
                    `Request successful | Sprint created for project ID ${projectId}`,
                    true
                );
                res.status(201).json(created.data);
            } else {
                this.logger.log(`Failed to create sprint: ${created.error}`);
                sendSiemEvent(this.siemService, req, created.code, created.error, true);
                res.status(created.code).json({ message: created.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, true);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * GET /projects/:projectId/sprints
     * @param {projectId} req.params - ID of the project
     * @returns {SprintDTO[]} - JSON array of sprints
     */
    private async getSprintsByProject(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        try {
            const projectId = parseInt(req.params.projectId, 10);
            if (isNaN(projectId)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid project ID", false);
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            this.logger.log(`Fetching sprints for project ID ${projectId}`);

            const list = await this.sprintService.getSprintsByProject(projectId);
            if (list.success) {
                this.logger.log(`Fetched ${list.data.length} sprints for project ID ${projectId}`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    200,
                    `Request successful | Retrieved sprints for project ID ${projectId}`,
                    false
                );
                res.status(200).json(list.data);
            } else {
                this.logger.log(`Failed to fetch sprints: ${list.error}`);
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
     * GET /sprints/:id
     * @param {id} req.params - Sprint ID
     * @returns {SprintDTO} - JSON format return
     */
    private async getSprintById(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if (isNaN(sprintId)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid sprint ID", false);
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            this.logger.log(`Fetching sprint by ID ${sprintId}`);

            const sprint = await this.sprintService.getSprintById(sprintId);
            if (sprint.success) {
                this.logger.log(`Sprint fetched successfully: ID ${sprintId}`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    200,
                    `Request successful | Retrieved sprint ID ${sprintId}`,
                    false
                );
                res.status(200).json(sprint.data);
            } else {
                this.logger.log(`Failed to fetch sprint: ${sprint.error}`);
                sendSiemEvent(this.siemService, req, sprint.code, sprint.error, false);
                res.status(sprint.code).json({ message: sprint.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, false);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * PUT /sprints/:id
     * @param {id and SprintUpdateDTO} req.params & req.body - Sprint ID and update data
     * @returns {SprintDTO} - JSON format return
     * @see {@link SprintUpdateDTO} for input structure
     */
    private async updateSprint(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if (isNaN(sprintId)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid sprint ID", true);
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            //Fetch sprint to get project ID
            const sprintResult = await this.sprintService.getSprintById(sprintId);
            if(!sprintResult.success) {
                this.logger.log(`Failed to fetch sprint before update: ${sprintResult.error}`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    sprintResult.code,
                    sprintResult.error,
                    true
                )
                res.status(sprintResult.code).json({ message: sprintResult.error });
                return;
            }
            const sprint = sprintResult.data;

            //Check permission for Project Manager
            const hasPermission = await checkProjectManagerPermission(
                req,
                this.projectUserService,
                sprint.project_id
            );
            if(!hasPermission) {
                sendSiemEvent(
                    this.siemService, 
                    req, 
                    403, 
                    `Forbidden | Project Manager has no access to project ${sprint.project_id}`,
                    true
                );
                res.status(403).json({ message: "Permission denied" });
                return;
            }

            const data = req.body as SprintUpdateDTO;

            this.logger.log(`Updating sprint ID ${sprintId} with data: ${JSON.stringify(data)}`);

            const updated = await this.sprintService.updateSprint(sprintId, data);
            if (updated.success) {
                this.logger.log(`Sprint ID ${sprintId} updated successfully`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    200,
                    `Request successful | Sprint ID ${sprintId} updated`,
                    true
                );
                res.status(200).json(updated.data);
            } else {
                this.logger.log(`Failed to update sprint: ${updated.error}`);
                sendSiemEvent(this.siemService, req, updated.code, updated.error, true);
                res.status(updated.code).json({ message: updated.error });
            }
        } catch (err) {
            this.logger.log((err as Error).message);
            sendSiemEvent(this.siemService, req, 500, (err as Error).message, false);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    /**
     * DELETE /sprints/:id
     * @param {id} req.params - Sprint ID
     * @returns {void} - No content
     */
    private async deleteSprint(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.id, 10);
            if (isNaN(sprintId)) {
                sendSiemEvent(this.siemService, req, 400, "Invalid sprint ID", true);
                res.status(400).json({ message: "Invalid sprint ID" });
                return;
            }

            //Fetch sprint to get project ID
            const sprintResult = await this.sprintService.getSprintById(sprintId);
            if(!sprintResult.success) {
                this.logger.log(`Failed to fetch sprint before deletion: ${sprintResult.error}`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    sprintResult.code,
                    sprintResult.error,
                    true
                )
                res.status(sprintResult.code).json({ message: sprintResult.error });
                return;
            }
            const sprint = sprintResult.data;

            //Check permission for Project Manager
            const hasPermission = await checkProjectManagerPermission(
                req,
                this.projectUserService,
                sprint.project_id
            );
            if(!hasPermission) {
                sendSiemEvent(
                    this.siemService, 
                    req, 
                    403, 
                    `Forbidden | Project Manager has no access to project ${sprint.project_id}`,
                    true
                );
                res.status(403).json({ message: "Permission denied" });
                return;
            }

            this.logger.log(`Deleting sprint ID ${sprintId}`);

            const ok = await this.sprintService.deleteSprint(sprintId);
            if (ok.success) {
                this.logger.log(`Sprint ID ${sprintId} deleted successfully`);
                sendSiemEvent(
                    this.siemService,
                    req,
                    204,
                    `Request successful | Sprint ID ${sprintId} deleted`,
                    true
                );
                res.status(204).send();
            } else {
                this.logger.log(`Failed to delete sprint: ${ok.error}`);
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