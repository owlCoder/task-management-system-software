// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayVersionControlService } from "../../Domain/services/version-control/IGatewayVersionControlService";
import { ReviewCommentDTO } from "../../Domain/DTOs/version-control/ReviewCommentDTO";
import { ReviewDTO } from "../../Domain/DTOs/version-control/ReviewDTO";
import { TaskTemplateDTO } from "../../Domain/DTOs/version-control/TaskTemplateDTO";
import { CreateTemplateDTO } from "../../Domain/DTOs/version-control/CreateTemplateDTO";
import { TaskResponseDTO } from "../../Domain/DTOs/version-control/TaskResponseDTO";
import { CreateTaskDTO } from "../../Domain/DTOs/version-control/CreateTaskDTO";
import { RejectReviewDTO } from "../../Domain/DTOs/version-control/RejectReviewDTO";
import { ReviewsQueryParams } from "../../Domain/types/version-control/ReviewsQueryParams";
import { Result } from "../../Domain/types/common/Result";
import { ReviewHistoryItemDTO } from "../../Domain/DTOs/version-control/ReviewHistoryItemDTO";

// Constants
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";
import { VERSION_CONTROL_ROUTES } from "../../Constants/routes/version-control/VersionControlRoutes";

// Infrastructure
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";

/**
 * Makes API requests to the Version-Control Microservice.
 */
export class GatewayVersionControlService implements IGatewayVersionControlService {
    private readonly versionClient: AxiosInstance;
        
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        this.versionClient = createAxiosClient(API_ENDPOINTS.VERSION_CONTROL);
    }

    /**
     * Sends task to review.
     * @param {number} taskId - id of the task. 
     * @param {number} senderId - id of the user who sent request.
     * @param {string} senderRole - role of the user who sent request
     * @returns {Promise<Result<ReviewDTO>>} - A promise that resolves to a Result object containing the data of the review.
     * - On success returns data as {@link ReviewDTO}.
     * - On failure returns status code and error message.
     */
    async sendToReview(taskId: number, senderId: number, senderRole: string): Promise<Result<ReviewDTO>> {
        return await makeAPICall<ReviewDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.SEND_REVIEW(taskId),
            headers: {
                "x-user-id": senderId.toString(),
                "x-user-role": senderRole
            }
        });
    }

    /**
     * Accepts the reviewed tasks.
     * @param {number} taskId - id of the task. 
     * @param {number} senderId - id of the user who sent request.
     * @param {string} senderRole - role of the user who sent request
     * @returns {Promise<Result<ReviewDTO>>} - A promise that resolves to a Result object containing the data of the review.
     * - On success returns data as {@link ReviewDTO}.
     * - On failure returns status code and error message.
     */
    async acceptReview(taskId: number, senderId: number, senderRole: string): Promise<Result<ReviewDTO>> {
        return await makeAPICall<ReviewDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.ACCEPT_REVIEW(taskId),
            headers: {
                "x-user-id": senderId.toString(),
                "x-user-role": senderRole
            }
        });
    }

    /**
     * Rejects the reviewed task.
     * @param {number} taskId - id of the task. 
     * @param {RejectReviewDTO} data - data describing why task was rejected
     * @param {number} senderId - id of the user who sent request.
     * @param {string} senderRole - role of the user who sent request
     * @returns {Promise<Result<ReviewDTO>>} - A promise that resolves to a Result object containing the data of the review.
     * - On success returns data as {@link ReviewDTO}.
     * - On failure returns status code and error message.
     */
    async rejectReview(taskId: number, data: RejectReviewDTO, senderId: number, senderRole: string): Promise<Result<ReviewCommentDTO>> {
        return await makeAPICall<ReviewCommentDTO, RejectReviewDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.REJECT_REVIEW(taskId),
            headers: {
                "x-user-id": senderId.toString(),
                "x-user-role": senderRole
            },
            data: data
        });
    }

    /**
     * Fetches the reviews of a status provided by the query.
     * @param {string} senderRole - role of the user who sent request
     * @param {ReviewsQueryParams} params - query containing the status type (optional).
     * @returns {Promise<Result<ReviewDTO[]>>} - A promise that resolves to a Result object containing the data of the reviews.
     * - On success returns data as {@link ReviewDTO[]}.
     * - On failure returns status code and error message.
     */
    async getReviews(senderRole: string, params: ReviewsQueryParams): Promise<Result<ReviewDTO[]>> {
        return await makeAPICall<ReviewDTO[], undefined, ReviewsQueryParams>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_REVIEWS,
            params: params,
            headers: {
                "x-user-role": senderRole
            }
        });
    }

    /**
     * Fetches the review history of the task.
     * @param {number} taskId - id of the task. 
     * @param {string} senderRole - role of the user who sent request
     * @returns {Promise<Result<ReviewHistoryItemDTO[]>>} - A promise that resolves to a Result object containing the data of the review history.
     * - On success returns data as {@link ReviewHistoryItemDTO[]}.
     * - On failure returns status code and error message.
     */
    async getReviewHistory(taskId: number, senderRole: string): Promise<Result<ReviewHistoryItemDTO[]>> {
        return await makeAPICall<ReviewHistoryItemDTO[]>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_REVIEW_HISTORY(taskId),
            headers: {
                "x-user-role": senderRole
            }
        });
    }

    /**
     * Fetches a specific comment from the review.
     * @param {number} commentId - id of the comment. 
     * @param {string} senderRole - role of the user who sent request
     * @returns {Promise<Result<ReviewCommentDTO>>} - A promise that resolves to a Result object containing the data of the comment.
     * - On success returns data as {@link ReviewCommentDTO}.
     * - On failure returns status code and error message.
     */
    async getReviewComment(commentId: number, senderRole: string): Promise<Result<ReviewCommentDTO>> {
        return await makeAPICall<ReviewCommentDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_REVIEW_COMMENT(commentId),
            headers: {
                "x-user-role": senderRole
            }
        });
    }

    /**
     * Fetches a specific template.
     * @param {number} templateId - id of the template.
     * @returns {Promise<Result<TaskTemplateDTO>>} - A promise that resolves to a Result object containing the data of the template.
     * - On success returns data as {@link TaskTemplateDTO}.
     * - On failure returns status code and error message.
     */
    async getTemplateById(templateId: number): Promise<Result<TaskTemplateDTO>> {
        return await makeAPICall<TaskTemplateDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_TEMPLATE(templateId)
        });
    }

    /**
     * Fetches all templates.
     * @returns {Promise<Result<TaskTemplateDTO[]>>} - A promise that resolves to a Result object containing the data of the templates.
     * - On success returns data as {@link TaskTemplateDTO[]}.
     * - On failure returns status code and error message.
     */
    async getAllTemplates(): Promise<Result<TaskTemplateDTO[]>> {
        return await makeAPICall<TaskTemplateDTO[]>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_ALL_TEMPLATES
        });
    }

    /**
     * Creates a new template.
     * @param {CreateTemplateDTO} data - data of the template. 
     * @param {number} senderId - id of the user who sent request.
     * @returns {Promise<Result<TaskTemplateDTO>>} - A promise that resolves to a Result object containing the data of the template.
     * - On success returns data as {@link TaskTemplateDTO}.
     * - On failure returns status code and error message.
     */
    async createTemplate(data: CreateTemplateDTO, senderId: number): Promise<Result<TaskTemplateDTO>> {
        return await makeAPICall<TaskTemplateDTO, CreateTemplateDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.CREATE_TEMPLATE,
            headers: {
                'x-user-id': senderId.toString()
            },
            data: data
        });
    }

    /**
     * Creates a task from template.
     * @param {number} templateId - id of the template.
     * @param {CreateTaskDTO} data - data of the task. 
     * @param {number} senderId - id of the user who sent request.
     * @returns {Promise<Result<TaskResponseDTO>>} - A promise that resolves to a Result object containing the data of the task.
     * - On success returns data as {@link TaskResponseDTO}.
     * - On failure returns status code and error message.
     */
    async createTaskFromTemplate(templateId: number, data: CreateTaskDTO, senderId: number): Promise<Result<TaskResponseDTO>> {
        return await makeAPICall<TaskResponseDTO, CreateTaskDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.CREATE_TASK(templateId),
            headers: { 
                'x-user-id': senderId.toString() 
            },
            data: data
        });
    }

    /**
     * Creates a dependency of the template.
     * @param {number} templateId - id of the template. 
     * @param {number} dependsOnId - id of the dependency.
     * @param {number} senderId - id of the user who sent request.
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async addDependency(templateId: number, dependsOnId: number, senderId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.CREATE_DEPENDENCY(templateId, dependsOnId),
            headers: {
                'x-user-id': senderId.toString()
            }
        });
    }
    
}
