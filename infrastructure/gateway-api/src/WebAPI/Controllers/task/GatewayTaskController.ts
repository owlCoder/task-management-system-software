// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayTaskService } from "../../../Domain/services/task/IGatewayTaskService";
import { CreateTaskDTO } from "../../../Domain/DTOs/task/CreateTaskDTO";
import { CreateCommentDTO } from "../../../Domain/DTOs/task/CreateCommentDTO";
import { TaskDTO } from "../../../Domain/DTOs/task/TaskDTO";
import { UpdateTaskDTO } from "../../../Domain/DTOs/task/UpdateTaskDTO";
import { CommentDTO } from "../../../Domain/DTOs/task/CommentDTO";
import { TaskPolicies } from "../../../Domain/access-policies/task/TaskPolicies";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";

/**
 * Routes client requests towards the Task Microservice.
 */
export class GatewayTaskController {
    private readonly router: Router;

    constructor(private readonly gatewayTaskService: IGatewayTaskService) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for Task Microservice.
     */
    private initializeRoutes() {
        const taskReadonlyAccess = [authenticate, authorize(...TaskPolicies.READONLY)];
        const taskWriteAccess = [authenticate, authorize(...TaskPolicies.WRITE)];

        this.router.get('/tasks/:taskId', ...taskReadonlyAccess, this.getTaskById.bind(this));
        this.router.get('/tasks/sprints/:sprintId', ...taskReadonlyAccess, this.getTasksBySprintId.bind(this));
        this.router.post('/tasks/sprints/:sprintId', ...taskWriteAccess, this.createTaskBySprintId.bind(this));
        this.router.put('/tasks/:taskId', ...taskWriteAccess, this.updateTaskById.bind(this));
        this.router.delete('/tasks/:taskId', ...taskWriteAccess, this.deleteTaskById.bind(this));
        this.router.post('/tasks/:taskId/comments', ...taskWriteAccess, this.addCommentByTaskId.bind(this));
        this.router.delete('/comments/:commentId', ...taskWriteAccess, this.deleteCommentById.bind(this));
    }

    /**
     * GET /api/v1/tasks/:taskId
     * @param {Request} req - the request object, containing the id of the task in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link TaskDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
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
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link TaskDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
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
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link TaskDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async createTaskBySprintId(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId, 10);
        const data = req.body as CreateTaskDTO;

        const result = await this.gatewayTaskService.addTaskBySprintId(sprintId, data);
        handleResponse(res, result, 201);
    }

    /**
     * PUT /api/v1/tasks/:taskId
     * @param {Request} req - the request object, containing the id of the task in params and data of the task as {@link UpdateTaskDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link TaskDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async updateTaskById(req: Request, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const data = req.body as UpdateTaskDTO;

        const result = await this.gatewayTaskService.updateTaskById(taskId, data);
        handleResponse(res, result);
    }

    /**
     * DELETE /api/v1/tasks/:taskId
     * @param {Request} req - the request object, containing the id of the task in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async deleteTaskById(req: Request, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);

        const result = await this.gatewayTaskService.deleteTaskById(taskId);
        handleEmptyResponse(res, result);
    }

    /**
     * POST /api/v1/tasks/:taskId/comments
     * @param {Request} req - the request object, containing the id of the task in params and data as {@link CreateCommentDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link CommentDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async addCommentByTaskId(req: Request, res: Response): Promise<void> {
        const taskId = parseInt(req.params.taskId, 10);
        const data = req.body as CreateCommentDTO;

        const result = await this.gatewayTaskService.addCommentByTaskId(taskId, data);
        handleResponse(res, result, 201);
    }

    /**
     * DELETE /api/v1/comments/:commentId
     * @param {Request} req - the request object, containing the id of the comment in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async deleteCommentById(req: Request, res: Response): Promise<void> {
        const commentId = parseInt(req.params.commentId, 10);

        const result = await this.gatewayTaskService.deleteCommentById(commentId);
        handleEmptyResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
}