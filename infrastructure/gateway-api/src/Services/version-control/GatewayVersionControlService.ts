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
import { Result } from "../../Domain/types/common/Result";

// Constants
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";
import { VERSION_CONTROL_ROUTES } from "../../Constants/routes/version-control/VersionControlRoutes";

// Infrastructure
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";

export class GatewayVersionControlService implements IGatewayVersionControlService {
    private readonly versionClient: AxiosInstance;
        
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        this.versionClient = createAxiosClient(API_ENDPOINTS.VERSION_CONTROL);
    }

    async sendToReview(taskId: number, senderId: number): Promise<Result<ReviewDTO>> {
        return await makeAPICall<ReviewDTO>(this.versionClient, this.errorHandlingService, {
            serviceName:SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.SEND_REVIEW(taskId),
            headers: {
                'x-user-id': senderId.toString()
            }
        });
    }

    async acceptReview(taskId: number, senderId: number): Promise<Result<ReviewDTO>> {
         return await makeAPICall<ReviewDTO>(this.versionClient, this.errorHandlingService, {
            serviceName:SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.ACCEPT_REVIEW(taskId),
            headers: {
                'x-user-id': senderId.toString()
            }
        });
    }

    async rejectReview(taskId: number, data: RejectReviewDTO, senderId: number): Promise<Result<ReviewCommentDTO>> {
         return await makeAPICall<ReviewCommentDTO, RejectReviewDTO>(this.versionClient, this.errorHandlingService, {
            serviceName:SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.REJECT_REVIEW(taskId),
            headers: {
                'x-user-id': senderId.toString()
            },
            data: data
        });
    }

    async getReviews(): Promise<Result<ReviewDTO[]>> {
         return await makeAPICall<ReviewDTO[]>(this.versionClient, this.errorHandlingService, {
            serviceName:SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_REVIEWS
        });
    }

    async getTemplateById(templateId: number): Promise<Result<TaskTemplateDTO>> {
        return await makeAPICall<TaskTemplateDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_TEMPLATE(templateId)
        });
    }

    async getAllTemplates(): Promise<Result<TaskTemplateDTO[]>> {
        return await makeAPICall<TaskTemplateDTO[]>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_ALL
        });
    }

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