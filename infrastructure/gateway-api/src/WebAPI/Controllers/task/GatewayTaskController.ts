// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayTaskService } from "../../../Domain/services/task/IGatewayTaskService";
import { CreateTaskDTO } from "../../../Domain/DTOs/task/CreateTaskDTO";
import { CreateCommentDTO } from "../../../Domain/DTOs/task/CreateCommentDTO";
import { TaskDTO } from "../../../Domain/DTOs/task/TaskDTO";
import { CommentDTO } from "../../../Domain/DTOs/task/CommentDTO";
import { UserRole } from "../../../Domain/enums/user/UserRole";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Utils
import { handleResponse } from "../../Utils/Http/ResponseHandler";

/**
 * Routes client requests towards the Task Microservice.
 */
export class GatewayTaskController {
    private readonly router: Router;

    constructor(private readonly gatewayTaskService: IGatewayTaskService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            '/tasks/:taskId', 
            authenticate, 
            authorize(UserRole.PROJECT_MANAGER, UserRole.ANALYTICS_DEVELOPMENT_MANAGER, UserRole.ANIMATION_WORKER, UserRole.AUDIO_MUSIC_STAGIST), 
            this.getTaskById.bind(this)
        );
        this.router.get(
            '/tasks/sprints/:sprintId', 
            authenticate, 
            authorize(UserRole.PROJECT_MANAGER, UserRole.ANALYTICS_DEVELOPMENT_MANAGER, UserRole.ANIMATION_WORKER, UserRole.AUDIO_MUSIC_STAGIST), 
            this.getTasksBySprintId.bind(this)
        );
        this.router.post('/tasks/sprints/:sprintId', authenticate, authorize(UserRole.PROJECT_MANAGER), this.createTaskBySprintId.bind(this));
        this.router.post('/tasks/:taskId/comments', authenticate, authorize(UserRole.PROJECT_MANAGER), this.addCommentByTaskId.bind(this));
    }

    /**
     * GET /api/v1/tasks/:taskId
     * @param {Request} req - the request object, containing the id of the task in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link TaskDTO} structure containing the result of the get task by id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getTaskById(req: Request, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);

        const result = await this.gatewayTaskService.getTaskById(taskId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/tasks/sprints/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link TaskDTO[]} structure containing the result of the get tasks by sprint id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getTasksBySprintId(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);

        const result = await this.gatewayTaskService.getTasksBySprintId(sprintId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/tasks/sprints/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params and data as {@link CreateTaskDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link TaskDTO} structure containing the result of the create task by sprint id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async createTaskBySprintId(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);
        const data = req.body as CreateTaskDTO;

        const result = await this.gatewayTaskService.addTaskBySprintId(sprintId, data);
        handleResponse(res, result, 201);
    }

    /**
     * POST /api/v1/tasks/:taskId/comments
     * @param {Request} req - the request object, containing the id of the task in params and data as {@link CreateCommentDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link CommentDTO} structure containing the result of the create comment by task id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async addCommentByTaskId(req: Request, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const data = req.body as CreateCommentDTO;

        const result = await this.gatewayTaskService.addCommentByTaskId(taskId, data);
        handleResponse(res, result, 201);
    }

    public getRouter(): Router {
        return this.router;
    }
}