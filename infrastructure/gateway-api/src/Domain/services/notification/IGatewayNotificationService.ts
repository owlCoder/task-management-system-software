import { NotificationCreateDTO } from "../../DTOs/notification/NotificationCreateDTO";
import { NotificationDTO } from "../../DTOs/notification/NotificationDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayNotificationService {
    getNotificationById(notificationId: number): Promise<Result<NotificationDTO>>;
    getNotificationsByUserId(userId: number): Promise<Result<NotificationDTO[]>>;
    getUnreadNotificationCount(userId: number): Promise<Result<number>>;
    createNotification(data: NotificationCreateDTO): Promise<Result<void>>;
    markNotificationAsRead(notificationId: number): Promise<Result<void>>;
    markNotificationAsUnread(notificationId: number): Promise<Result<void>>;
    markMultipleNotificationsAsRead(notificationIds: number[]): Promise<Result<void>>;
    markMultipleNotificationsAsUnread(notificationIds: number[]): Promise<Result<void>>;
    deleteNotification(notificationId: number): Promise<Result<void>>;
    deleteMultipleNotifications(notificationIds: number[]): Promise<Result<void>>;
}