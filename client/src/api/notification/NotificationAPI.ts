import axios from 'axios';
import type { Notification } from '../../models/notification/NotificationCardDTO';
import type { INotificationAPI } from './INotificationAPI';
import { NotificationType } from '../../enums/NotificationType';

export class NotificationAPI implements INotificationAPI {
  
  private baseURL = 'http://localhost:6432/api';

  // GET /api/notifications/user/:userId
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    const response = await axios.get(`${this.baseURL}/notifications/user/${userId}`);
    return response.data;
  }

  // GET /api/notifications/user/:userId/unread-count
  async getUnreadCount(userId: number): Promise<number> {
    const response = await axios.get(`${this.baseURL}/notifications/user/${userId}/unread-count`);
    return response.data.unreadCount;
  }

  // POST /api/notifications
  async createNotification(data: {
    title: string;
    content: string;
    type: NotificationType;
    userIds: number[];
  }): Promise<Notification[]> {
    const response = await axios.post(`${this.baseURL}/notifications`, data);
    return response.data;
  }

  // PATCH /api/notifications/:id/read
  async markAsRead(id: number): Promise<void> {
    await axios.patch(`${this.baseURL}/notifications/${id}/read`);
  }

  // PATCH /api/notifications/:id/unread
  async markAsUnread(id: number): Promise<void> {
    await axios.patch(`${this.baseURL}/notifications/${id}/unread`);
  }

  // PATCH /api/notifications/bulk/read
  async markMultipleAsRead(ids: number[]): Promise<void> {
    await axios.patch(`${this.baseURL}/notifications/bulk/read`, { ids });
  }

  // PATCH /api/notifications/bulk/unread
  async markMultipleAsUnread(ids: number[]): Promise<void> {
    await axios.patch(`${this.baseURL}/notifications/bulk/unread`, { ids });
  }

  // DELETE /api/notifications/:id
  async deleteNotification(id: number): Promise<void> {
    await axios.delete(`${this.baseURL}/notifications/${id}`);
  }

  // DELETE /api/notifications/bulk
  async deleteMultipleNotifications(ids: number[]): Promise<void> {
    await axios.delete(`${this.baseURL}/notifications/bulk`, { data: { ids } });
  }
}

export const notificationAPI = new NotificationAPI();