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
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

/**
 * Makes API requests to the Notification Microservice.
 */
export class GatewayNotificationService implements IGatewayNotificationService {
    private readonly notificationClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.notificationClient = axios.create({
            baseURL: API_ENDPOINTS.NOTIFICATION,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    /**
     * Fetches a specific notification.
     * @param {number} id - id of the notification. 
     * @returns {Promise<Result<NotificationDTO>>} - A promise that resolves to a Result object containing the notification data.
     * - On success returns data as {@link NotificationDTO}.
     * - On failure returns status code and error message.
     */
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

    /**
     * Fetches notifications of a specific user.
     * @param {number} userId - id of the user. 
     * @returns {Promise<Result<NotificationDTO[]>>} - A promise that resolves to a Result object containing the notification data.
     * - On success returns data as {@link NotificationDTO[]}.
     * - On failure returns status code and error message.
     */
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

    /**
     * Fetches the number of the unread notifications for a specific user.
     * @param {number} id - id of the user. 
     * @returns {Promise<Result<NotificationDTO>>} - A promise that resolves to a Result object containing the number of unread notifications.
     * - On success returns data as number that represents how many notifications are unread.
     * - On failure returns status code and error message.
     */
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

    /**
     * Marks notification as read.
     * @param {number} id - id of the notification. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
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

    /**
     * Marks notification as unread.
     * @param {number} id - id of the notification. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
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
    
    /**
     * Marks multiple notifications as read.
     * @param {number[]} ids - ids of the notifications. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
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

    /**
     * Marks multiple notifications as unread.
     * @param {number[]} ids - ids of the notifications. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
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

    /**
     * Requests the deletion of a specific notification.
     * @param {number} id - id of the notification.
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
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

    /**
     * Requests the deletion of multiple notifications.
     * @param {number[]} ids - ids of the notifications. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
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
