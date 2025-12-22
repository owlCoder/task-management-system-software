import { NotificationType } from '../enums/NotificationType';

export interface NotificationCreateDTO {
  title: string;
  content: string;
  type: NotificationType;
  userId?: number;
}