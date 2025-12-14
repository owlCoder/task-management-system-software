import { NotificationCreateDTO } from '../DTOs/NotificationCreateDTO';
import { NotificationUpdateDTO } from '../DTOs/NotificationUpdateDTO';
import { NotificationResponseDTO } from '../DTOs/NotificationDTO';

export interface INotificationService {
  
  // CRUD
  createNotification(data: NotificationCreateDTO): Promise<NotificationResponseDTO>;
  getNotificationById(id: number): Promise<NotificationResponseDTO | null>;
  getNotificationsByUserId(userId: number): Promise<NotificationResponseDTO[]>;
  updateNotification(id: number, data: NotificationUpdateDTO): Promise<NotificationResponseDTO | null>;
  deleteNotification(id: number): Promise<boolean>;
  
  // mark as read/unread
  markAsRead(id: number): Promise<NotificationResponseDTO | null>;
  markAsUnread(id: number): Promise<NotificationResponseDTO | null>;
  
  // bulk operacije
  markMultipleAsRead(ids: number[]): Promise<void>;
  markMultipleAsUnread(ids: number[]): Promise<void>;
  deleteMultipleNotifications(ids: number[]): Promise<void>;
  
  // counter
  getUnreadCount(userId: number): Promise<number>;
  
  // WebSocket support
  setSocketService(socketService: any): void;
}