import { NotificationType } from '../enums/NotificationType';

export interface NotificationCreateDTO {
  title: string;
  content: string;
  type: NotificationType;
  userId?: number;
}

export class NotificationCreateRequest implements NotificationCreateDTO {
  title: string;
  content: string;
  type: NotificationType;
  userId?: number;

  constructor(
    title: string, 
    content: string, 
    type: NotificationType, 
    userId?: number
  ) {
    this.title = title;
    this.content = content;
    this.type = type;
    this.userId = userId;
  }
}