import type { NotificationResponseDTO } from '../DTOs/NotificationDTO';

export interface ISocketService {
  emitNotificationCreated(notification: NotificationResponseDTO): void;
  emitNotificationDeleted(notificationId: number, userId: number): void;
  emitNotificationMarkedRead(notification: NotificationResponseDTO): void;
  emitNotificationMarkedUnread(notification: NotificationResponseDTO): void;
  emitNotificationsBulkDeleted(ids: number[], userId: number): void;
  emitNotificationsBulkMarkedRead(ids: number[], userId: number): void;
  emitNotificationsBulkMarkedUnread(ids: number[], userId: number): void;
}
