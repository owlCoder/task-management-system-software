export const SocketEvents = {
  // Server → Client events
  NOTIFICATION_CREATED: 'notification:created',
  NOTIFICATION_DELETED: 'notification:deleted',
  NOTIFICATION_MARKED_READ: 'notification:marked_read',
  NOTIFICATION_MARKED_UNREAD: 'notification:marked_unread',
  NOTIFICATIONS_BULK_DELETED: 'notifications:bulk_deleted',
  NOTIFICATIONS_BULK_MARKED_READ: 'notifications:bulk_marked_read',
  NOTIFICATIONS_BULK_MARKED_UNREAD: 'notifications:bulk_marked_unread',

  // Client → Server events
  JOIN_USER_ROOM: 'join:user_room',
  LEAVE_USER_ROOM: 'leave:user_room',

  // Connection events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
} as const;