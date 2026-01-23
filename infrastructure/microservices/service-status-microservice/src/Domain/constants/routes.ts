export const ROUTES = {
    AUTH_SERVICE_API: "http://localhost:5544/api/v1/auth/login",
    USER_SERVICE_API: "http://localhost:6754/api/v1/users",
    FILE_SERVICE_API: "http://localhost:3303/api/v1/health",
    PROJECT_SERVICE_API: "http://localhost:5000/api/v1/projects",
    TASK_SERVICE_API: "http://localhost:12234/api/v1/dev/dummy-tasks",
    NOTIFICATION_SERVICE_API: "http://localhost:6432/api/v1/health",
    ANALYTICS_SERVICE_API: "http://localhost:4444/api/v1/health",
    MAIL_MICROSERVICE_API: "http://localhost:5544/api/v1/MailAlive",
    GATEWAY_API: "http://localhost:5173/health"
} as const;