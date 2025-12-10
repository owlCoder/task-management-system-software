import type { Notification } from '../../models/notification/NotificationCardDTO';

export interface INotificationAPI {
  
  // GET operacije
  getAllNotifications(): Promise<Notification[]>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  getUnreadCount(userId: number): Promise<number>;
  
  // POST operacije
  createNotification(data: {
    title: string;
    content: string;
    type: 'info' | 'warning' | 'error';
    userId: number;
  }): Promise<Notification>;
  
  // PATCH operacije (mark as read/unread)
  markAsRead(id: number): Promise<Notification>;
  markAsUnread(id: number): Promise<Notification>;
  markMultipleAsRead(ids: number[]): Promise<void>;
  markMultipleAsUnread(ids: number[]): Promise<void>;
  
  // DELETE operacije
  deleteNotification(id: number): Promise<void>;
  deleteMultipleNotifications(ids: number[]): Promise<void>;
}