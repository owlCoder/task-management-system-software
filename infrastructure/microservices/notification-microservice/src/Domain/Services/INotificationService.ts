import { NotificationCreateDTO } from '../DTOs/NotificationCreateDTO';
import { NotificationResponseDTO } from '../DTOs/NotificationDTO';

export interface INotificationService {
  
  // CRUD
  createNotification(data: NotificationCreateDTO): Promise<NotificationResponseDTO | null>;
  getNotificationById(id: number): Promise<NotificationResponseDTO | null>;
  getNotificationsByUserId(userId: number): Promise<NotificationResponseDTO[]>;
  deleteNotification(id: number): Promise<boolean>;
  
  // mark as read/unread
  markAsRead(id: number): Promise<NotificationResponseDTO | null>;
  markAsUnread(id: number): Promise<NotificationResponseDTO | null>;
  
  // bulk operacije
  markMultipleAsRead(ids: number[]): Promise<boolean>;
  markMultipleAsUnread(ids: number[]): Promise<boolean>;
  deleteMultipleNotifications(ids: number[]): Promise<boolean>;
  
  // counter
  getUnreadCount(userId: number): Promise<number>;
  
  // WebSocket support
  setSocketService(socketService: any): void;
}
