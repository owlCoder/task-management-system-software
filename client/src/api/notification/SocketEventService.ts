import { ISocketEventService } from "./ISocketEventService";
import { ISocketManager } from "./ISocketManager";
import { SocketEvents } from "../../constants/SocketEvents";
import type { Notification } from "../../models/notification/NotificationCardDTO";

// Odvojen od SocketManager-a koji upravlja konekcijom
export class SocketEventService implements ISocketEventService {
  private readonly socketManager: ISocketManager;

  constructor(socketManager: ISocketManager) {
    this.socketManager = socketManager;
  }

  // Registruje listener za notification:created event
  onNotificationCreated(callback: (notification: Notification) => void): void {
    const socket = this.socketManager.getSocket();
    socket?.on(SocketEvents.NOTIFICATION_CREATED, callback);
  }

  // Registruje listener za notification:updated event
  onNotificationUpdated(callback: (notification: Notification) => void): void {
    const socket = this.socketManager.getSocket();
    socket?.on(SocketEvents.NOTIFICATION_UPDATED, callback);
  }

  // Registruje listener za notification:deleted event
  onNotificationDeleted(callback: (data: { id: number }) => void): void {
    const socket = this.socketManager.getSocket();
    socket?.on(SocketEvents.NOTIFICATION_DELETED, callback);
  }

  // Registruje listener za notification:marked_read event
  onNotificationMarkedRead(callback: (notification: Notification) => void): void {
    const socket = this.socketManager.getSocket();
    socket?.on(SocketEvents.NOTIFICATION_MARKED_READ, callback);
  }

  // Registruje listener za notification:marked_unread event
  onNotificationMarkedUnread(callback: (notification: Notification) => void): void {
    const socket = this.socketManager.getSocket();
    socket?.on(SocketEvents.NOTIFICATION_MARKED_UNREAD, callback);
  }

  // Registruje listener za notifications:bulk_deleted event
  onNotificationsBulkDeleted(callback: (data: { ids: number[] }) => void): void {
    const socket = this.socketManager.getSocket();
    socket?.on(SocketEvents.NOTIFICATIONS_BULK_DELETED, callback);
  }

  // Registruje listener za notifications:bulk_marked_read event
  onNotificationsBulkMarkedRead(callback: (data: { ids: number[] }) => void): void {
    const socket = this.socketManager.getSocket();
    socket?.on(SocketEvents.NOTIFICATIONS_BULK_MARKED_READ, callback);
  }

  // Registruje listener za notifications:bulk_marked_unread event
  onNotificationsBulkMarkedUnread(callback: (data: { ids: number[] }) => void): void {
    const socket = this.socketManager.getSocket();
    socket?.on(SocketEvents.NOTIFICATIONS_BULK_MARKED_UNREAD, callback);
  }

  // Uklanja sve event listeners
  removeAllListeners(): void {
    const socket = this.socketManager.getSocket();
    socket?.removeAllListeners();
  }

  // Uklanja listener za odredjeni event
  removeListener(eventName: string): void {
    const socket = this.socketManager.getSocket();
    socket?.off(eventName);
  }
}
