export const NOTIFICATION_ROUTES = Object.freeze({
    GET_NOTIFICATION: (id: number) => `/notifications/${id}`,
    GET_NOTIFICATIONS_FROM_USER: (userId: number) => `/notifications/user/${userId}`,
    GET_UNREAD_NOTIFICATIONS_COUNT: (userId: number) => `/notifications/user/${userId}/unread-count`,
    CREATE_NOTIFICATION: `/notifications`,
    MARK_NOTIFICATION_AS_READ: (id: number) => `/notifications/${id}/read`,
    MARK_NOTIFICATION_AS_UNREAD: (id: number) => `/notifications/${id}/unread`,
    MARK_MULTIPLE_NOTIFICATIONS_AS_READ: `/notifications/bulk/read`,
    MARK_MULTIPLE_NOTIFICATIONS_AS_UNREAD: `/notifications/bulk/unread`,
    DELETE_NOTIFICATION: (id: number) => `/notifications/${id}`,
    DELETE_MULTIPLE_NOTIFICATIONS: `/notifications/bulk`,
} as const);