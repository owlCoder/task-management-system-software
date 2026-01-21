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
    
}