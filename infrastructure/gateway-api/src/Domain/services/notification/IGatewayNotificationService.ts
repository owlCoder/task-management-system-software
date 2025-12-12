import { NotificationDTO } from "../../DTOs/notification/NotificationDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayNotificationService {
    getNotificationById(id: number): Promise<Result<NotificationDTO>>;
    getNotificationsByUserId(userId: number): Promise<Result<NotificationDTO[]>>;
    getUnreadNotificationCount(id: number): Promise<Result<number>>;
    markNotificationAsRead(id: number): Promise<Result<NotificationDTO>>;
    markNotificationAsUnread(id: number): Promise<Result<NotificationDTO>>;
    markMultipleNotificationsAsRead(ids: number[]): Promise<Result<NotificationDTO[]>>;
    markMultipleNotificationsAsUnread(ids: number[]): Promise<Result<NotificationDTO[]>>;
    deleteNotification(id: number): Promise<Result<boolean>>;
    deleteMultipleNotifications(ids: number[]): Promise<Result<void>>;
}