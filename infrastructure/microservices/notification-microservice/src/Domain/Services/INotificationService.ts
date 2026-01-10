import { NotificationCreateDTO } from '../DTOs/NotificationCreateDTO';
import { NotificationResponseDTO } from '../DTOs/NotificationDTO';
import { Result } from '../types/common/Result';

export interface INotificationService {
  createNotification(data: NotificationCreateDTO): Promise<Result<NotificationResponseDTO[]>>;
  getNotificationById(id: number): Promise<Result<NotificationResponseDTO>>;
  getNotificationsByUserId(userId: number): Promise<Result<NotificationResponseDTO[]>>;
  deleteNotification(id: number): Promise<Result<void>>;

  markAsRead(id: number): Promise<Result<void>>;
  markAsUnread(id: number): Promise<Result<void>>;

  markMultipleAsRead(ids: number[]): Promise<Result<void>>;
  markMultipleAsUnread(ids: number[]): Promise<Result<void>>;
  deleteMultipleNotifications(ids: number[]): Promise<Result<void>>;

  getUnreadCount(userId: number): Promise<Result<number>>;

  setSocketService(socketService: any): void;
}
