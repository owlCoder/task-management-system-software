// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayProjectService } from "../../../Domain/services/project/IGatewayProjectService";
import { ProjectDTO } from "../../../Domain/DTOs/project/ProjectDTO";
import { SprintDTO } from "../../../Domain/DTOs/project/SprintDTO";
import { SprintCreateDTO } from "../../../Domain/DTOs/project/SprintCreateDTO";
import { SprintUpdateDTO } from "../../../Domain/DTOs/project/SprintUpdateDTO";
import { ProjectUserAssignDTO } from "../../../Domain/DTOs/project/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../../../Domain/DTOs/project/ProjectUserDTO";
import { ProjectPolicies } from "../../../Domain/access-policies/project/ProjectPolicies";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";

// Infrastructure
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";

/**
 * Routes client requests towards the Project Microservice.
 */
export class GatewayProjectController {
    private readonly router: Router;

    constructor(private readonly gatewayProjectService: IGatewayProjectService) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for Project Microservice.
     */
    private initializeRoutes() {
        const projectReadonlyAccess = [authenticate, authorize(...ProjectPolicies.READONLY)];
        const projectWriteAccess = [authenticate, authorize(...ProjectPolicies.WRITE)];

        this.router.get("/projects", ...projectReadonlyAccess, this.getAllProjects.bind(this));
        this.router.get("/project-ids", ...projectReadonlyAccess, this.getAllProjectIds.bind(this));
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
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ProjectDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getProjectById(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);

        const result = await this.gatewayProjectService.getProjectById(projectId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/projects
     * @param {Request} _req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ProjectDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getAllProjects(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayProjectService.getAllProjects();
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/project-ids
     * @param {Request} _req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link number[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getAllProjectIds(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayProjectService.getAllProjectIds();
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/users/:userId/projects
     * @param {Request} req - the request object, containing the id of the user in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ProjectDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getProjectsFromUser(req: Request<ReqParams<'userId'>>, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayProjectService.getProjectsFromUser(userId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/projects
     * @param {Request} req - the request object, containing the data of the project in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link ProjectDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async createProject(req: Request, res: Response): Promise<void> {
        if (!req.headers['content-type']?.includes('multipart/form-data')) {
            res.status(400).json({ message: "Bad request" });
            return;
        }

        const result = await this.gatewayProjectService.createProject(req);
        handleResponse(res, result, 201);
    }

    /**
     * PUT /api/v1/projects/:projectId
     * @param {Request} req - the request object, containing the id in params and data of the project in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ProjectDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async updateProject(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        if (!req.headers['content-type']?.includes('multipart/form-data')) {
            res.status(400).json({ message: "Bad request" });
            return;
        }
        const projectId = parseInt(req.params.projectId, 10);
        const senderId = req.user!.id;

        const result = await this.gatewayProjectService.updateProject(projectId, req, senderId);
        handleResponse(res, result);
    }

    /**
     * DELETE /api/v1/projects/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async deleteProject(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);
        const senderId = req.user!.id;

        const result = await this.gatewayProjectService.deleteProject(projectId, senderId);
        handleEmptyResponse(res, result);
    }

    /**
     * GET /api/v1/projects/:projectId/sprints
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link SprintDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getSprintsByProject(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);

        const result = await this.gatewayProjectService.getSprintsByProject(projectId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/sprints/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link SprintDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getSprintById(req: Request<ReqParams<'sprintId'>>, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);

        const result = await this.gatewayProjectService.getSprintById(sprintId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/projects/:projectId/sprints
     * @param {Request} req - the request object, containing the id of the project in params and data of the sprint as {@link SprintCreateDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link SprintDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async createSprint(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);
        const data = req.body as SprintCreateDTO;
        const senderId = req.user!.id;

        const result = await this.gatewayProjectService.createSprint(projectId, data, senderId);
        handleResponse(res, result, 201);
    }

    /**
     * PUT /api/v1/sprints/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params and data of the sprint as {@link SprintUpdateDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link SprintDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async updateSprint(req: Request<ReqParams<'sprintId'>>, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);
        const data = req.body as SprintUpdateDTO;
        const senderId = req.user!.id;

        const result = await this.gatewayProjectService.updateSprint(sprintId, data, senderId);
        handleResponse(res, result);
    }

    /**
     * DELETE /api/v1/sprints/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async deleteSprint(req: Request<ReqParams<'sprintId'>>, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);
        const senderId = req.user!.id;

        const result = await this.gatewayProjectService.deleteSprint(sprintId, senderId);
        handleEmptyResponse(res, result);
    }

    /**
     * GET /api/v1/projects/:projectId/users
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ProjectUserDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getUsersFromProject(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);

        const result = await this.gatewayProjectService.getUsersFromProject(projectId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/projects/:projectId/users
     * @param {Request} req - the request object, containing the id of the project in params and the data of the user as {@link ProjectUserAssignDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link ProjectUserDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async assignUser(req: Request<ReqParams<'projectId'>>, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);
        const data = req.body as ProjectUserAssignDTO;

        const result = await this.gatewayProjectService.assignUserToProject(projectId, data);
        handleResponse(res, result, 201);
    }

    /**
     * DELETE /api/v1/projects/:projectId/users/:userId
     * @param {Request} req - the request object, containing the id of the project and the id of the user in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async removeUser(req: Request<ReqParams<'projectId' | 'userId'>>, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId, 10);
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayProjectService.removeUserFromProject(projectId, userId);
        handleEmptyResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
}