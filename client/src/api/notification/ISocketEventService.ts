import type { Notification } from "../../models/notification/NotificationCardDTO";

// Interfejs za Socket Event Service
// Definiše operacije za event handling (SRP - Single Responsibility)
export interface ISocketEventService {
  // Notification event handlers
  onNotificationCreated(callback: (notification: Notification) => void): void;
  onNotificationUpdated(callback: (notification: Notification) => void): void;
  onNotificationDeleted(callback: (data: { id: number }) => void): void;
  onNotificationMarkedRead(callback: (notification: Notification) => void): void;
  onNotificationMarkedUnread(callback: (notification: Notification) => void): void;

  // Bulk operation handlers
  onNotificationsBulkDeleted(callback: (data: { ids: number[] }) => void): void;
  onNotificationsBulkMarkedRead(callback: (data: { ids: number[] }) => void): void;
  onNotificationsBulkMarkedUnread(callback: (data: { ids: number[] }) => void): void;

  // Utility
  removeAllListeners(): void;
  removeListener(eventName: string): void;
}
