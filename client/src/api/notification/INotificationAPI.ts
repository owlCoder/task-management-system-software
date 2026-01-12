import type { Notification } from '../../models/notification/NotificationCardDTO';
import { NotificationType } from '../../enums/NotificationType';

export interface INotificationAPI {
  
  // GET operacije
  getNotificationsByUserId(token:string,userId: number): Promise<Notification[]>;
  getUnreadCount(token:string,userId: number): Promise<number>;
  
  // POST operacije
  createNotification(token:string,data: {
    title: string;
    content: string;
    type: NotificationType;
    userIds: number[];
  }): Promise<void>;
  
  // PATCH operacije (mark as read/unread)
  markAsRead(token:string,id: number): Promise<void>;
  markAsUnread(token:string,id: number): Promise<void>;
  markMultipleAsRead(token:string,ids: number[]): Promise<void>;
  markMultipleAsUnread(token:string,ids: number[]): Promise<void>;
  
  // DELETE operacije
  deleteNotification(token:string,id: number): Promise<void>;
  deleteMultipleNotifications(token:string,ids: number[]): Promise<void>;
}