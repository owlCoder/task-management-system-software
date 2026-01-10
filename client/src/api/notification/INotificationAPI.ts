import type { Notification } from '../../models/notification/NotificationCardDTO';
import { NotificationType } from '../../enums/NotificationType';

export interface INotificationAPI {
  
  // GET operacije
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  getUnreadCount(userId: number): Promise<number>;
  
  // POST operacije
  createNotification(data: {
    title: string;
    content: string;
    type: NotificationType;
    userIds: number[];
  }): Promise<void>;
  
  // PATCH operacije (mark as read/unread)
  markAsRead(id: number): Promise<void>;
  markAsUnread(id: number): Promise<void>;
  markMultipleAsRead(ids: number[]): Promise<void>;
  markMultipleAsUnread(ids: number[]): Promise<void>;
  
  // DELETE operacije
  deleteNotification(id: number): Promise<void>;
  deleteMultipleNotifications(ids: number[]): Promise<void>;
}