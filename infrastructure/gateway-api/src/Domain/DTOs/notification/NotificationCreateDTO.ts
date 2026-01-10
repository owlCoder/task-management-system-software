import { NotificationType } from "../../enums/notification/NotificationType";

export interface NotificationCreateDTO {
    title: string;
    content: string;
    type: NotificationType;
    userIds: number[];
}