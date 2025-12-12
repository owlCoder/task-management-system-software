export const NOTIFICATION_ROUTES = {
    GET_BY_ID: (id: number) => `/notifications/${id}`,
    GET_BY_USER_ID: (userId: number) => `/notifications/user/${userId}`,
    GET_UNREAD_COUNT: (userId: number) => `/notifications/user/${userId}/unread-count`,
    MARK_AS_READ: (id: number) => `/notifications/${id}/read`,
    MARK_AS_UNREAD: (id: number) => `/notifications/${id}/unread`,
    MARK_MULTIPLE_AS_READ: `/notifications/bulk/read`,
    MARK_MULTIPLE_AS_UNREAD: `/notifications/bulk/unread`,
    DELETE: (id: number) => `/notifications/${id}`,
    DELETE_MULTIPLE: `/notifications/bulk`,
}