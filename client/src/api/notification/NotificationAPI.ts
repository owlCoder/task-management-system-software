import axios, {AxiosInstance } from 'axios';
import type { Notification } from '../../models/notification/NotificationCardDTO';
import type { INotificationAPI } from './INotificationAPI';
import { NotificationType } from '../../enums/NotificationType';

export class NotificationAPI implements INotificationAPI {

  private notificationClient: AxiosInstance;

  constructor(baseUrl: string) {
    this.notificationClient = axios.create({
      baseURL: baseUrl
    });
  }

  // GET /api/notifications/user/:userId
  async getNotificationsByUserId(
    token: string,
    userId: number
  ): Promise<Notification[]> {
    try {
      const response = await this.notificationClient.get(
        `/notifications/user/${userId}`,
        {headers: {Authorization: `Bearer ${token}`}}
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching notifications by user ID:', error);
      throw error;
    }
  }

  // GET /api/notifications/user/:userId/unread-count
  async getUnreadCount(token: string, userId: number): Promise<number> {
    try {
      const response = await this.notificationClient.get(`/notifications/user/${userId}/unread-count`,  {headers: {Authorization: `Bearer ${token}`}});
      return response.data.unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // POST /api/notifications
  async createNotification(token: string, data: {
    title: string;
    content: string;
    type: NotificationType;
    userIds: number[];
  }): Promise<void> {
    try {
      await this.notificationClient.post(`/notifications`, data ,  {headers: {Authorization: `Bearer ${token}`}});
      // Ne vracamo data - notifikacija stize preko Socket.IO
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // PATCH /api/notifications/:id/read
  async markAsRead(token: string, id: number): Promise<void> {
    try {
      await this.notificationClient.patch(`/notifications/${id}/read`,  {headers: {Authorization: `Bearer ${token}`}});
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // PATCH /api/notifications/:id/unread
  async markAsUnread(token: string, id: number): Promise<void> {
    try {
      await this.notificationClient.patch(`/notifications/${id}/unread`,  {headers: {Authorization: `Bearer ${token}`}});
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      throw error;
    }
  }

  // PATCH /api/notifications/bulk/read
  async markMultipleAsRead(token: string, ids: number[]): Promise<void> {
    try {
      await this.notificationClient.patch(`/notifications/bulk/read`, { ids },  {headers: {Authorization: `Bearer ${token}`}});
    } catch (error) {
      console.error('Error marking multiple notifications as read:', error);
      throw error;
    }
  }

  // PATCH /api/notifications/bulk/unread
  async markMultipleAsUnread(token: string, ids: number[]): Promise<void> {
    try {
      await this.notificationClient.patch(`/notifications/bulk/unread`, { ids },  {headers: {Authorization: `Bearer ${token}`}});
    } catch (error) {
      console.error('Error marking multiple notifications as unread:', error);
      throw error;
    }
  }

  // DELETE /api/notifications/:id
  async deleteNotification(token: string, id: number): Promise<void> {
    try {
      await this.notificationClient.delete(`/notifications/${id}`, {headers: {Authorization: `Bearer ${token}`}});
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // DELETE /api/notifications/bulk
  async deleteMultipleNotifications(token: string, ids: number[]): Promise<void> {
    try {
      await this.notificationClient.delete(`/notifications/bulk`, { data: { ids }, headers: {Authorization: `Bearer ${token}`} });
    } catch (error) {
      console.error('Error deleting multiple notifications:', error);
      throw error;
    }
  }
}
