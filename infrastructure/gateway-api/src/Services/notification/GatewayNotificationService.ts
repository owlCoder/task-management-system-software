// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayNotificationService } from "../../Domain/services/notification/IGatewayNotificationService";
import { NotificationDTO } from "../../Domain/DTOs/notification/NotificationDTO";
import { NotificationCreateDTO } from "../../Domain/DTOs/notification/NotificationCreateDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { NOTIFICATION_ROUTES } from "../../Constants/routes/notification/NotificationRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";

/**
 * Makes API requests to the Notification Microservice.
 */
export class GatewayNotificationService implements IGatewayNotificationService {
    private readonly notificationClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.notificationClient = createAxiosClient(API_ENDPOINTS.NOTIFICATION);
    }

    /**
     * Fetches a specific notification.
     * @param {number} notificationId - id of the notification. 
     * @returns {Promise<Result<NotificationDTO>>} - A promise that resolves to a Result object containing the notification data.
     * - On success returns data as {@link NotificationDTO}.
     * - On failure returns status code and error message.
     */
    async getNotificationById(notificationId: number): Promise<Result<NotificationDTO>> {
        return await makeAPICall<NotificationDTO>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.GET,
            url: NOTIFICATION_ROUTES.GET_NOTIFICATION(notificationId) 
        });
    }

    /**
     * Fetches notifications of a specific user.
     * @param {number} userId - id of the user. 
     * @returns {Promise<Result<NotificationDTO[]>>} - A promise that resolves to a Result object containing the notification data.
     * - On success returns data as {@link NotificationDTO[]}.
     * - On failure returns status code and error message.
     */
    async getNotificationsByUserId(userId: number): Promise<Result<NotificationDTO[]>> {
        return await makeAPICall<NotificationDTO[]>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.GET,
            url: NOTIFICATION_ROUTES.GET_NOTIFICATIONS_FROM_USER(userId) 
        });
    }

    /**
     * Fetches the number of the unread notifications for a specific user.
     * @param {number} userId - id of the user. 
     * @returns {Promise<Result<NotificationDTO>>} - A promise that resolves to a Result object containing the number of unread notifications.
     * - On success returns data as number that represents how many notifications are unread.
     * - On failure returns status code and error message.
     */
    async getUnreadNotificationCount(userId: number): Promise<Result<number>> {
        return await makeAPICall<number>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.GET,
            url: NOTIFICATION_ROUTES.GET_UNREAD_NOTIFICATIONS_COUNT(userId) 
        });
    }

    /**
     * Creates a new notification.
     * @param {NotificationCreateDTO} data - notification data containing notification details and recipient ids.
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async createNotification(data: NotificationCreateDTO): Promise<Result<void>> {
        return await makeAPICall<void, NotificationCreateDTO>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.POST,
            url: NOTIFICATION_ROUTES.CREATE_NOTIFICATION,
            data: data
        });
    }

    /**
     * Marks notification as read.
     * @param {number} notificationId - id of the notification. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async markNotificationAsRead(notificationId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.PATCH,
            url: NOTIFICATION_ROUTES.MARK_NOTIFICATION_AS_READ(notificationId)
        });
    }

    /**
     * Marks notification as unread.
     * @param {number} notificationId - id of the notification. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async markNotificationAsUnread(notificationId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.PATCH,
            url: NOTIFICATION_ROUTES.MARK_NOTIFICATION_AS_UNREAD(notificationId) 
        });
    }
    
    /**
     * Marks multiple notifications as read.
     * @param {number[]} notificationIds - ids of the notifications. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async markMultipleNotificationsAsRead(notificationIds: number[]): Promise<Result<void>> {
        return await makeAPICall<void, number[]>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.PATCH,
            url: NOTIFICATION_ROUTES.MARK_MULTIPLE_NOTIFICATIONS_AS_READ,
            data: notificationIds
        });
    }

    /**
     * Marks multiple notifications as unread.
     * @param {number[]} notificationIds - ids of the notifications. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async markMultipleNotificationsAsUnread(notificationIds: number[]): Promise<Result<void>> {
        return await makeAPICall<void, number[]>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.PATCH,
            url: NOTIFICATION_ROUTES.MARK_MULTIPLE_NOTIFICATIONS_AS_UNREAD,
            data: notificationIds
        });
    }

    /**
     * Requests the deletion of a specific notification.
     * @param {number} notificationId - id of the notification.
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteNotification(notificationId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.DELETE,
            url: NOTIFICATION_ROUTES.DELETE_NOTIFICATION(notificationId)
        });
    }

    /**
     * Requests the deletion of multiple notifications.
     * @param {number[]} notificationIds - ids of the notifications. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteMultipleNotifications(notificationIds: number[]): Promise<Result<void>> {
        return await makeAPICall<void, number[]>(this.notificationClient, this.errorHandlingService, {
            serviceName: SERVICES.NOTIFICATION,
            method: HTTP_METHODS.DELETE,
            url: NOTIFICATION_ROUTES.DELETE_MULTIPLE_NOTIFICATIONS,
            data: notificationIds
        });
    }

}
