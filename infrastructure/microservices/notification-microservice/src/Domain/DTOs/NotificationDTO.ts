import { NotificationType } from '../enums/NotificationType';

export interface NotificationResponseDTO {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationResponse implements NotificationResponseDTO {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: NotificationResponseDTO) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.type = data.type;
    this.isRead = data.isRead;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}