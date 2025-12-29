// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayProjectService } from "../../../Domain/services/project/IGatewayProjectService";
import { ProjectCreateDTO } from "../../../Domain/DTOs/project/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../../Domain/DTOs/project/ProjectUpdateDTO";
import { ProjectDTO } from "../../../Domain/DTOs/project/ProjectDTO";
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

    private initializeRoutes() {
        this.router.get(
            "/projects/:id", 
            authenticate, 
            authorize(UserRole.PROJECT_MANAGER, UserRole.ANALYTICS_DEVELOPMENT_MANAGER, UserRole.ANIMATION_WORKER, UserRole.AUDIO_MUSIC_STAGIST), 
            this.getProjectById.bind(this)
        );
        this.router.post("/projects", authenticate, authorize(UserRole.PROJECT_MANAGER), this.createProject.bind(this));
        this.router.put("/projects/:id", authenticate, authorize(UserRole.PROJECT_MANAGER), this.updateProject.bind(this));
        this.router.delete("/projects/:id", authenticate, authorize(UserRole.PROJECT_MANAGER), this.deleteProject.bind(this));
    }

    /**
     * GET /api/v1/projects/:id
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProjectDTO} structure containing the result of the get project by id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getProjectById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);

        const result = await this.gatewayProjectService.getProjectById(id);
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
     * PUT /api/v1/projects/:id
     * @param {Request} req - the request object, containing the id in params and data of the project as {@link ProjectUpdateDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProjectDTO} structure containing the result of the update project operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async updateProject(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        const data = req.body as ProjectUpdateDTO;

        const result = await this.gatewayProjectService.updateProject(id, data);
        handleResponse(res, result);
    }

    /**
     * DELETE /api/v1/projects/:id
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async deleteProject(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);

        const result = await this.gatewayProjectService.deleteProject(id);
        handleEmptyResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
}