import { NotificationType } from "../../enums/notification/NotificationType";

export interface NotificationDTO {
    id: number;
    title: string;
    content: string;
    type: NotificationType;
    isRead: boolean;
    userId?: number;
    createdAt: Date;
    updatedAt: Date;
}