import { NotificationType } from '../enums/NotificationType';

export interface NotificationResponseDTO {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  userId?: number;
  createdAt: Date;
}