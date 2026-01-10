import { NotificationType } from "../../enums/NotificationType";

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  userId: number;
  createdAt: string;
}

export interface NotificationCardProps {
  notification: Notification;
  onClick?: (id: number) => void;
  isSelected?: boolean;
  onSelectChange?: (id: number) => void;
  className?: string;
}
