// Libraries
import axios, { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayNotificationService } from "../../Domain/services/notification/IGatewayNotificationService";
import { NotificationDTO } from "../../Domain/DTOs/notification/NotificationDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { NOTIFICATION_ROUTES } from "../../Constants/routes/notification/NotificationRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";

export class GatewayNotificationService implements IGatewayNotificationService {
    private readonly notificationClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        const notificationBaseURL = process.env.NOTIFICATION_SERVICE_API;

        this.notificationClient = axios.create({
            baseURL: notificationBaseURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async getNotificationById(id: number): Promise<Result<NotificationDTO>> {
        try {
            const response = await this.notificationClient.get<NotificationDTO>(NOTIFICATION_ROUTES.GET_BY_ID(id));

            return { 
                success: true, 
                data: response.data 
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.GET, NOTIFICATION_ROUTES.GET_BY_ID(id));
        }
    }

    async getNotificationsByUserId(userId: number): Promise<Result<NotificationDTO[]>> {
        try {
            const response = await this.notificationClient.get<NotificationDTO[]>(NOTIFICATION_ROUTES.GET_BY_USER_ID(userId));

            return { 
                success: true, 
                data: response.data 
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.GET, NOTIFICATION_ROUTES.GET_BY_USER_ID(userId));
        }
    }

    async getUnreadNotificationCount(id: number): Promise<Result<number>> {
        try {
            const response = await this.notificationClient.get<number>(NOTIFICATION_ROUTES.GET_UNREAD_COUNT(id));

            return { 
                success: true, 
                data: response.data 
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.GET, NOTIFICATION_ROUTES.GET_UNREAD_COUNT(id));
        }
    }

    async markNotificationAsRead(id: number): Promise<Result<void>> {
        try {
            await this.notificationClient.patch<void>(NOTIFICATION_ROUTES.MARK_AS_READ(id));

            return { 
                success: true, 
                data: undefined 
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.PATCH, NOTIFICATION_ROUTES.MARK_AS_READ(id));
        }
    }

    async markNotificationAsUnread(id: number): Promise<Result<void>> {
        try {
            await this.notificationClient.patch<void>(NOTIFICATION_ROUTES.MARK_AS_UNREAD(id));

            return { 
                success: true, 
                data: undefined
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.PATCH, NOTIFICATION_ROUTES.MARK_AS_UNREAD(id));
        }
    }
    
    async markMultipleNotificationsAsRead(ids: number[]): Promise<Result<void>> {
        try {
            await this.notificationClient.patch<void>(NOTIFICATION_ROUTES.MARK_MULTIPLE_AS_READ, ids);

            return { 
                success: true, 
                data: undefined
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.PATCH, NOTIFICATION_ROUTES.MARK_MULTIPLE_AS_READ);
        }
    }

    async markMultipleNotificationsAsUnread(ids: number[]): Promise<Result<void>> {
        try {
            await this.notificationClient.patch<void>(NOTIFICATION_ROUTES.MARK_MULTIPLE_AS_UNREAD, ids);

            return { 
                success: true, 
                data: undefined
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.PATCH, NOTIFICATION_ROUTES.MARK_MULTIPLE_AS_UNREAD);
        }
    }

    async deleteNotification(id: number): Promise<Result<void>> {
        try {
            await this.notificationClient.delete<void>(NOTIFICATION_ROUTES.DELETE(id));

            return { 
                success: true, 
                data: undefined
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.DELETE, NOTIFICATION_ROUTES.DELETE(id));
        }
    }

    async deleteMultipleNotifications(ids: number[]): Promise<Result<void>> {
        try {
            await this.notificationClient.delete<void>(NOTIFICATION_ROUTES.DELETE_MULTIPLE, { data: ids });

            return { 
                success: true,
                data: undefined
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.NOTIFICATION, HTTP_METHODS.DELETE, NOTIFICATION_ROUTES.DELETE_MULTIPLE);
        }
    }

}
