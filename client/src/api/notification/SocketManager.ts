/*import { io, Socket } from "socket.io-client";
import type { Notification } from "../../models/notification/NotificationCardDTO";

export const SocketEvents = {
  // Server → Client events
  NOTIFICATION_CREATED: "notification:created",
  NOTIFICATION_UPDATED: "notification:updated",
  NOTIFICATION_DELETED: "notification:deleted",
  NOTIFICATION_MARKED_READ: "notification:marked_read",
  NOTIFICATION_MARKED_UNREAD: "notification:marked_unread",
  NOTIFICATIONS_BULK_DELETED: "notifications:bulk_deleted",
  NOTIFICATIONS_BULK_MARKED_READ: "notifications:bulk_marked_read",
  NOTIFICATIONS_BULK_MARKED_UNREAD: "notifications:bulk_marked_unread",

  // Client → Server events
  JOIN_USER_ROOM: "join:user_room",
  LEAVE_USER_ROOM: "leave:user_room",
} as const;

// Socket Manager
// Upravlja WebSocket konekcijom i event listeners
export class SocketManager {
  private socket: Socket | null = null;
  private baseURL = "http://localhost:6432";

  // Konektuje se na WebSocket server
  connect(): void {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    this.socket = io(this.baseURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  // Diskonektuje WebSocket konekciju
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected");
    }
  }

  // Pridruzuje se "sobi" za odredjenog korisnika
  joinUserRoom(userId: number): void {
    if (this.socket?.connected) {
      this.socket.emit(SocketEvents.JOIN_USER_ROOM, userId);
      console.log(`👤 Joined user room: ${userId}`);
    }
  }

  // Napusta "sobu" za odredjenog korisnika
  leaveUserRoom(userId: number): void {
    if (this.socket?.connected) {
      this.socket.emit(SocketEvents.LEAVE_USER_ROOM, userId);
      console.log(`👋 Left user room: ${userId}`);
    }
  }

  // Registruje listener za notification:created event
  onNotificationCreated(callback: (notification: Notification) => void): void {
    this.socket?.on(SocketEvents.NOTIFICATION_CREATED, callback);
  }

  // Registruje listener za notification:updated event
  onNotificationUpdated(callback: (notification: Notification) => void): void {
    this.socket?.on(SocketEvents.NOTIFICATION_UPDATED, callback);
  }

  // Registruje listener za notification:deleted event
  onNotificationDeleted(callback: (data: { id: number }) => void): void {
    this.socket?.on(SocketEvents.NOTIFICATION_DELETED, callback);
  }

  // Registruje listener za notification:marked_read event
  onNotificationMarkedRead(
    callback: (notification: Notification) => void
  ): void {
    this.socket?.on(SocketEvents.NOTIFICATION_MARKED_READ, callback);
  }

  // Registruje listener za notification:marked_unread event
  onNotificationMarkedUnread(
    callback: (notification: Notification) => void
  ): void {
    this.socket?.on(SocketEvents.NOTIFICATION_MARKED_UNREAD, callback);
  }

  // Registruje listener za notifications:bulk_deleted event

  onNotificationsBulkDeleted(
    callback: (data: { ids: number[] }) => void
  ): void {
    this.socket?.on(SocketEvents.NOTIFICATIONS_BULK_DELETED, callback);
  }

  // Registruje listener za notifications:bulk_marked_read event
  onNotificationsBulkMarkedRead(
    callback: (data: { ids: number[] }) => void
  ): void {
    this.socket?.on(SocketEvents.NOTIFICATIONS_BULK_MARKED_READ, callback);
  }

  // Registruje listener za notifications:bulk_marked_unread event
  onNotificationsBulkMarkedUnread(
    callback: (data: { ids: number[] }) => void
  ): void {
    this.socket?.on(SocketEvents.NOTIFICATIONS_BULK_MARKED_UNREAD, callback);
  }

  // Uklanja sve event listeners
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  // Getter za socket instancu
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketManager = new SocketManager();
*/
