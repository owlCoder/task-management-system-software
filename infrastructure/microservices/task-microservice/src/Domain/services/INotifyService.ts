import { NotificationType } from "../enums/NotificationType";

export interface INotifyService {
  sendNotification(userIds: number[], title: string, content: string, type?: NotificationType): void;
}
