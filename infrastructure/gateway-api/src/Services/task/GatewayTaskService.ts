// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayTaskService } from "../../Domain/services/task/IGatewayTaskService";
import { CommentDTO } from "../../Domain/DTOs/task/CommentDTO";
import { CreateCommentDTO } from "../../Domain/DTOs/task/CreateCommentDTO";
import { CreateTaskDTO } from "../../Domain/DTOs/task/CreateTaskDTO";
import { TaskDTO } from "../../Domain/DTOs/task/TaskDTO";
import { UpdateTaskDTO } from "../../Domain/DTOs/task/UpdateTaskDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { SERVICES } from "../../Constants/services/Services";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { TASK_ROUTES } from "../../Constants/routes/task/TaskRoutes";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";

/**
 * Makes API requests to the Task Microservice.
 */
export class GatewayTaskService implements IGatewayTaskService {
    private readonly taskClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        this.taskClient = createAxiosClient(API_ENDPOINTS.TASK);
    }

    /**
     * Fetches the specific task.
     * @param {number} taskId - id of the task. 
     * @returns {Promise<Result<TaskDTO>>} - A promise that resolves to a Result object containing the data of the task.
     * - On success returns data as {@link TaskDTO}.
     * - On failure returns status code and error message.
     */
    async getTaskById(taskId: number): Promise<Result<TaskDTO>> {
        return await makeAPICall<TaskDTO>(this.taskClient, this.errorHandlingService, {
            serviceName: SERVICES.TASK,
            method: HTTP_METHODS.GET,
            url: TASK_ROUTES.GET_TASK(taskId)
        });
    }
    
    /**
     * Fetches tasks of the specific sprint.
     * @param {number} sprintId - id of the sprint. 
     * @returns {Promise<Result<TaskDTO[]>>} - A promise that resolves to a Result object containing the data of the tasks.
     * - On success returns data as {@link TaskDTO[]}.
     * - On failure returns status code and error message.
     */
    async getTasksBySprintId(sprintId: number): Promise<Result<TaskDTO[]>> {
        return await makeAPICall<TaskDTO[]>(this.taskClient, this.errorHandlingService, {
            serviceName: SERVICES.TASK,
            method: HTTP_METHODS.GET,
            url: TASK_ROUTES.GET_TASKS_FROM_SPRINT(sprintId)
        });
    }
    
    /**
     * Creates new task in a sprint.
     * @param {number} sprintId - id of the sprint.
     * @param {CreateTaskDTO} data - task data. 
     * @returns {Promise<Result<TaskDTO>>} - A promise that resolves to a Result object containing the data of the task.
     * - On success returns data as {@link TaskDTO}.
     * - On failure returns status code and error message.
     */
    async addTaskBySprintId(sprintId: number, data: CreateTaskDTO): Promise<Result<TaskDTO>> {
        return await makeAPICall<TaskDTO, CreateTaskDTO>(this.taskClient, this.errorHandlingService, {
            serviceName: SERVICES.TASK,
            method: HTTP_METHODS.POST,
            url: TASK_ROUTES.ADD_TASK_TO_SPRINT(sprintId),
            data: data
        });
    }
    
    /**
     * Updates an existing task.
     * @param {number} taskId - id of the task.
     * @param {CreateTaskDTO} data - updated task data. 
     * @returns {Promise<Result<TaskDTO>>} - A promise that resolves to a Result object containing the data of the task.
     * - On success returns data as {@link TaskDTO}.
     * - On failure returns status code and error message.
     */
    async updateTaskById(taskId: number, data: UpdateTaskDTO): Promise<Result<TaskDTO>> {
        return await makeAPICall<TaskDTO, UpdateTaskDTO>(this.taskClient, this.errorHandlingService, {
            serviceName: SERVICES.TASK,
            method: HTTP_METHODS.PUT,
            url: TASK_ROUTES.UPDATE_TASK(taskId),
            data: data
        });
    }

    /**
     * Requests a deletion of a specific task.
     * @param {number} taskId - id of the task. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteTaskById(taskId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.taskClient, this.errorHandlingService, {
            serviceName: SERVICES.TASK,
            method: HTTP_METHODS.DELETE,
            url: TASK_ROUTES.DELETE_TASK(taskId)
        });
    }

    /**
     * Adds a comment to a specific task.
     * @param {number} taskId - id of the task. 
     * @param {CreateCommentDTO} data - comment data.
     * @returns {Promise<Result<TaskDTO>>} - A promise that resolves to a Result object containing the data of the comment.
     * - On success returns data as {@link CommentDTO}.
     * - On failure returns status code and error message.
     */
    async addCommentByTaskId(taskId: number, data: CreateCommentDTO): Promise<Result<CommentDTO>> {
        return await makeAPICall<CommentDTO, CreateCommentDTO>(this.taskClient, this.errorHandlingService, {
            serviceName: SERVICES.TASK,
            method: HTTP_METHODS.POST,
            url: TASK_ROUTES.ADD_COMMENT_TO_TASK(taskId),
            data: data
        });
    }

    /**
     * Requests a deletion of a specific comment.
     * @param {number} commentId - id of the comment. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteCommentById(commentId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.taskClient, this.errorHandlingService, {
            serviceName: SERVICES.TASK,
            method: HTTP_METHODS.DELETE,
            url: TASK_ROUTES.DELETE_COMMENT(commentId)
        });
    }

}