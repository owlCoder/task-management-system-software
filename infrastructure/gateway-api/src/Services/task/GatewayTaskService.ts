// Libraries
import axios, { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayTaskService } from "../../Domain/services/task/IGatewayTaskService";
import { CommentDTO } from "../../Domain/DTOs/task/CommentDTO";
import { CreateCommentDTO } from "../../Domain/DTOs/task/CreateCommentDTO";
import { CreateTaskDTO } from "../../Domain/DTOs/task/CreateTaskDTO";
import { TaskDTO } from "../../Domain/DTOs/task/TaskDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { SERVICES } from "../../Constants/services/Services";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { TASK_ROUTES } from "../../Constants/routes/task/TaskRoutes";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";

/**
 * Makes API requests to the Task Microservice.
 */
export class GatewayTaskService implements IGatewayTaskService {
    private readonly taskClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        this.taskClient = axios.create({
            baseURL: API_ENDPOINTS.TASK,
            timeout: 5000,
        });
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
            url: TASK_ROUTES.GET_BY_ID(taskId)
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
            url: TASK_ROUTES.GET_BY_SPRINT_ID(sprintId)
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
            url: TASK_ROUTES.ADD_TASK_BY_SPRINT_ID(sprintId),
            data: data
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
            url: TASK_ROUTES.ADD_COMMENT_BY_TASK_ID(taskId),
            data: data
        });
    }

}