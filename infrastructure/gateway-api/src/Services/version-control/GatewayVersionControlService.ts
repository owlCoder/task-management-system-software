import { ReviewCommentDTO } from "../../Domain/DTOs/version-control/ReviewCommentDTO";
import { ReviewDTO } from "../../Domain/DTOs/version-control/ReviewDTO";
import { IGatewayVersionControlService } from "../../Domain/services/version-control/IGatewayVersionControlService";
import { Result } from "../../Domain/types/common/Result";
import { Request } from "express";
import { AxiosInstance } from "axios";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";
import { makeAPICall, makeAPIUploadStreamCall } from "../../Infrastructure/axios/APIHelpers";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { VERSION_CONTROL_ROUTES } from "../../Constants/routes/version-control/Version-ControlRoutes";
import { TaskTemplateDTO } from "../../Domain/DTOs/version-control/TaskTemplateDTO";
import { CreateTemplateDTO } from "../../Domain/DTOs/version-control/CreateTemplateDTO";
import { TaskResponseDTO } from "../../Domain/DTOs/version-control/TaskResponseDTO";
import { CreateTaskDTO } from "../../Domain/DTOs/version-control/CreateTaskDTO";
import { serialize } from "v8";



export class GatewayVersionControlService implements IGatewayVersionControlService {
    private readonly versionClient: AxiosInstance;
        
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        this.versionClient = createAxiosClient(API_ENDPOINTS.VERSION_CONTROL, { headers: {} });
    }

    async sendToReview(taskId: number, authorId: number): Promise<Result<ReviewDTO>> {
        return await makeAPICall<ReviewDTO>(this.versionClient, this.errorHandlingService, {
            serviceName:SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.SEND_REVIEW(taskId),
            headers: {
                'x-user-id': authorId.toString()
            }
        });
    }
    async acceptReview(taskId: number, reviewedBy: number): Promise<Result<ReviewDTO>> {
         return await makeAPICall<ReviewDTO>(this.versionClient, this.errorHandlingService, {
            serviceName:SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.ACCEPT_REVIEW(taskId),
            headers: {
                'x-user-id': reviewedBy.toString()
            }
        });
    }
    async rejectReview(taskId: number, reviewedBy: number, rejectComment: string): Promise<Result<ReviewCommentDTO>> {
         return await makeAPICall<ReviewCommentDTO,{ commentText: string }>(this.versionClient, this.errorHandlingService, {
            serviceName:SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.REJECT_REVIEW(taskId),
            headers: {
                'x-user-id': reviewedBy.toString()
            },
            data: {
                commentText: rejectComment
            }
        });
    }
    async getReviews(): Promise<Result<ReviewDTO[]>> {
         return await makeAPICall<ReviewDTO[]>(this.versionClient, this.errorHandlingService, {
            serviceName:SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_REVIEW(),
            headers: {}
        });
    }

    async getTemplateById(template_id: number): Promise<Result<TaskTemplateDTO>> {
        return await makeAPICall<TaskTemplateDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_TEMPLATE(template_id),
            headers: {}
        });
    }

    async getAllTemplates(): Promise<Result<TaskTemplateDTO[]>> {
        return await makeAPICall<TaskTemplateDTO[]>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.GET,
            url: VERSION_CONTROL_ROUTES.GET_ALL(),
            headers: {}
        });
    }

    async createTemplate(data: CreateTemplateDTO, pm_id: number): Promise<Result<TaskTemplateDTO>> {
        return await makeAPICall<TaskTemplateDTO, CreateTemplateDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.CREATE_TEMPLATE(),
            headers: {'x-user-id': pm_id.toString()},
            data: data,
        });
    }

    async createTaskFromTemplate(template_id: number, sprint_id: number, worker_id: number, pm_id: number): Promise<Result<TaskResponseDTO>> {
        return await makeAPICall<TaskResponseDTO, CreateTaskDTO>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.CREATE_TASK(template_id),
            headers: { 'x-user-id': pm_id.toString() },
            data: { sprint_id, worker_id }
        });
    }

    async addDependency(template_id: number, depends_on_id: number, pm_id: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.versionClient, this.errorHandlingService, {
            serviceName: SERVICES.VERSION_CONTROL,
            method: HTTP_METHODS.POST,
            url: VERSION_CONTROL_ROUTES.CREATE_DEPENDENCY(template_id, depends_on_id),
            headers: {'x-user-id': pm_id.toString()}
        });
    }
    
}