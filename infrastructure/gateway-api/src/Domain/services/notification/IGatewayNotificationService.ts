import { NotificationDTO } from "../../DTOs/notification/NotificationDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayNotificationService {
    getNotificationById(id: number): Promise<Result<NotificationDTO>>;
    getNotificationsByUserId(userId: number): Promise<Result<NotificationDTO[]>>;
    getUnreadNotificationCount(id: number): Promise<Result<number>>;
    markNotificationAsRead(id: number): Promise<Result<void>>;
    markNotificationAsUnread(id: number): Promise<Result<void>>;
    markMultipleNotificationsAsRead(ids: number[]): Promise<Result<void>>;
    markMultipleNotificationsAsUnread(ids: number[]): Promise<Result<void>>;
    deleteNotification(id: number): Promise<Result<void>>;
    deleteMultipleNotifications(ids: number[]): Promise<Result<void>>;
}