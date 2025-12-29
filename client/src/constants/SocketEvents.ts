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

// Type za SocketEvents vrednosti
export type SocketEventType = typeof SocketEvents[keyof typeof SocketEvents];
