// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayProjectService } from "../../../Domain/services/project/IGatewayProjectService";
import { ProjectCreateDTO } from "../../../Domain/DTOs/project/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../../Domain/DTOs/project/ProjectUpdateDTO";
import { ProjectDTO } from "../../../Domain/DTOs/project/ProjectDTO";
import { SprintDTO } from "../../../Domain/DTOs/project/SprintDTO";
import { SprintCreateDTO } from "../../../Domain/DTOs/project/SprintCreateDTO";
import { SprintUpdateDTO } from "../../../Domain/DTOs/project/SprintUpdateDTO";
import { ProjectUserAssignDTO } from "../../../Domain/DTOs/project/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../../../Domain/DTOs/project/ProjectUserDTO";
import { UserRole } from "../../../Domain/enums/user/UserRole";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";

/**
 * Routes client requests towards the Project Microservice.
 */
export class GatewayProjectController {
    private readonly router: Router;

    constructor(private readonly gatewayProjectService : IGatewayProjectService) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for Project Microservice.
     */
    private initializeRoutes() {
        const projectReadonlyAccess = [
            authenticate, 
            authorize(UserRole.PROJECT_MANAGER, UserRole.ANALYTICS_DEVELOPMENT_MANAGER, UserRole.ANIMATION_WORKER, UserRole.AUDIO_MUSIC_STAGIST)
        ];
        const projectWriteAccess = [authenticate, authorize(UserRole.PROJECT_MANAGER)];

        this.router.get("/projects/:projectId", ...projectReadonlyAccess, this.getProjectById.bind(this));
        this.router.get("/users/:userId/projects", ...projectReadonlyAccess, this.getProjectsFromUser.bind(this));
        this.router.post("/projects", ...projectWriteAccess, this.createProject.bind(this));
        this.router.put("/projects/:projectId", ...projectWriteAccess, this.updateProject.bind(this));
        this.router.delete("/projects/:projectId", ...projectWriteAccess, this.deleteProject.bind(this));

        this.router.get("/projects/:projectId/sprints", ...projectReadonlyAccess, this.getSprintsByProject.bind(this));
        this.router.get("/sprints/:sprintId", ...projectReadonlyAccess, this.getSprintById.bind(this));
        this.router.post("/projects/:projectId/sprints", ...projectWriteAccess, this.createSprint.bind(this));
        this.router.put("/sprints/:sprintId", ...projectWriteAccess, this.updateSprint.bind(this));
        this.router.delete("/sprints/:sprintId", ...projectWriteAccess, this.deleteSprint.bind(this));

        this.router.get("/projects/:projectId/users", ...projectReadonlyAccess, this.getUsersFromProject.bind(this));
        this.router.post("/projects/:projectId/users", ...projectWriteAccess, this.assignUser.bind(this));
        this.router.delete("/projects/:projectId/users/:userId", ...projectWriteAccess, this.removeUser.bind(this));
    }

    /**
     * GET /api/v1/projects/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProjectDTO} structure containing the result of the get project by id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getProjectById(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);

        const result = await this.gatewayProjectService.getProjectById(projectId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/users/:userId/projects
     * @param {Request} req - the request object, containing the id of the user in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProjectDTO[]} structure containing the result of the get projects from user operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getProjectsFromUser(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayProjectService.getProjectsFromUser(userId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/projects
     * @param {Request} req - the request object, containing the data of the project as {@link ProjectCreateDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProjectDTO} structure containing the result of the create project operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async createProject(req: Request, res: Response): Promise<void> {
        const data = req.body as ProjectCreateDTO;

        const result = await this.gatewayProjectService.createProject(data);
        handleResponse(res, result, 201);
    }

    /**
     * PUT /api/v1/projects/:projectId
     * @param {Request} req - the request object, containing the id in params and data of the project as {@link ProjectUpdateDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProjectDTO} structure containing the result of the update project operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async updateProject(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);
        const data = req.body as ProjectUpdateDTO;

        const result = await this.gatewayProjectService.updateProject(projectId, data);
        handleResponse(res, result);
    }

    /**
     * DELETE /api/v1/projects/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async deleteProject(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);

        const result = await this.gatewayProjectService.deleteProject(projectId);
        handleEmptyResponse(res, result);
    }

    /**
     * GET /api/v1/projects/:projectId/sprints
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link SprintDTO[]} structure containing the result of the get sprints by project operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getSprintsByProject(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);

        const result = await this.gatewayProjectService.getSprintsByProject(projectId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/sprints/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link SprintDTO} structure containing the result of the get sprint by id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getSprintById(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);
        
        const result = await this.gatewayProjectService.getSprintById(sprintId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/projects/:projectId/sprints
     * @param {Request} req - the request object, containing the id of the project in params and data of the sprint as {@link SprintCreateDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link SprintDTO} structure containing the result of the create sprint operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async createSprint(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);
        const data = req.body as SprintCreateDTO;

        const result = await this.gatewayProjectService.createSprint(projectId, data);
        handleResponse(res, result, 201);
    }

    /**
     * PUT /api/v1/sprints/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params and data of the sprint as {@link SprintUpdateDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link SprintDTO} structure containing the result of the update sprint operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async updateSprint(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);
        const data = req.body as SprintUpdateDTO;

        const result = await this.gatewayProjectService.updateSprint(sprintId, data);
        handleResponse(res, result);
    }

    /**
     * DELETE /api/v1/sprints/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async deleteSprint(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);

        const result = await this.gatewayProjectService.deleteSprint(sprintId);
        handleEmptyResponse(res, result);
    }

    /**
     * GET /api/v1/projects/:projectId/users
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProjectUserDTO[]} structure containing the result of the get users from project operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getUsersFromProject(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);

        const result = await this.gatewayProjectService.getUsersFromProject(projectId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/projects/:projectId/users
     * @param {Request} req - the request object, containing the id of the project in params and the data of the user as {@link ProjectUserAssignDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProjectUserDTO} structure containing the result of the assign user to project operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async assignUser(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);
        const data = req.body as ProjectUserAssignDTO;

        const result = await this.gatewayProjectService.assignUserToProject(projectId, data);
        handleResponse(res, result, 201);
    }

    /**
     * DELETE /api/v1/projects/:projectId/users/:userId
     * @param {Request} req - the request object, containing the id of the project and the id of the user in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async removeUser(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayProjectService.removeUserFromProject(projectId, userId);
        handleEmptyResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
}