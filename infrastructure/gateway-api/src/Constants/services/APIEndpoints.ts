export const API_ENDPOINTS = Object.freeze({
    AUTH: process.env.AUTH_SERVICE_API!,
    USER: process.env.USER_SERVICE_API!,
    PROJECT: process.env.PROJECT_SERVICE_API!,
    TASK: process.env.TASK_SERVICE_API!,
    FILE: process.env.FILE_SERVICE_API!,
    NOTIFICATION: process.env.NOTIFICATION_SERVICE_API!,
    ANALYTICS: process.env.ANALYTICS_SERVICE_API!,
    VERSION_CONTROL: process.env.VERSION_SERVICE_API!
} as const);