# Notification Microservice

A microservice responsible for managing user notifications with real-time WebSocket support.

## Features

- Create notifications for one or multiple users
- Get notifications by user ID
- Mark notifications as read/unread (single or bulk)
- Delete notifications (single or bulk)
- Get unread notification count
- Real-time notifications via WebSocket (Socket.IO)

## Architecture

The microservice is structured following SOLID principles:
- **Domain Layer**: Models, DTOs, interfaces (`Notification`, `NotificationCreateDTO`, `INotificationService`, `ISocketService`)
- **Service Layer**: Business logic (`NotificationService`)
- **WebAPI Layer**: Controllers and validators (`NotificationController`, `NotificationValidation`)
- **WebSocket Layer**: Real-time communication (`SocketService`, `SocketEvents`)
- **Database Layer**: TypeORM connection (`DbConnectionPool`, `InitializeConnection`)

## API Endpoints

All routes are prefixed with `/api/v1`.

### Notifications

| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| GET | `/notifications/:id` | Get notification by ID | None | 200: NotificationResponseDTO, 404: Not found |
| GET | `/notifications/user/:userId` | Get all notifications for a user | None | 200: NotificationResponseDTO[] |
| GET | `/notifications/user/:userId/unread-count` | Get unread notification count | None | 200: `{ unreadCount: number }` |
| POST | `/notifications` | Create a notification | NotificationCreateDTO | 204: Created |
| PATCH | `/notifications/:id/read` | Mark as read | None | 204: Success |
| PATCH | `/notifications/:id/unread` | Mark as unread | None | 204: Success |
| DELETE | `/notifications/:id` | Delete notification | None | 200: Success |

### Bulk Operations

| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| PATCH | `/notifications/bulk/read` | Mark multiple as read | `{ ids: number[] }` | 200: Success |
| PATCH | `/notifications/bulk/unread` | Mark multiple as unread | `{ ids: number[] }` | 200: Success |
| DELETE | `/notifications/bulk` | Delete multiple notifications | `{ ids: number[] }` | 200: Success |

### Health Check

| Method | Route | Description | Response |
|--------|-------|-------------|----------|
| GET    | `/health` | Service health check | 200: `{ status, service, version, timestamp }` |

## WebSocket Events

The service uses Socket.IO for real-time notifications.

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_user_room` | `userId: number` | Join user's notification room |
| `leave_user_room` | `userId: number` | Leave user's notification room |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `notification_created` | `NotificationResponseDTO` | New notification created |
| `notification_deleted` | `{ id: number }` | Notification deleted |
| `notification_marked_read` | `NotificationResponseDTO` | Marked as read |
| `notification_marked_unread` | `NotificationResponseDTO` | Marked as unread |
| `notifications_bulk_deleted` | `{ ids: number[] }` | Multiple notifications deleted |
| `notifications_bulk_marked_read` | `{ ids: number[] }` | Multiple marked as read |
| `notifications_bulk_marked_unread` | `{ ids: number[] }` | Multiple marked as unread |

## Request/Response DTOs

### NotificationCreateDTO
```json
{
  "userIds": [1, 2, 3],
  "title": "Notification title",
  "message": "Notification content",
  "type": "INFO"
}
NotificationResponseDTO

{
  "id": 1,
  "userId": 1,
  "title": "Title",
  "message": "Content",
  "type": "INFO",
  "isRead": false,
  "createdAt": "2024-01-01T12:00:00.000Z"
}

Setup
Install dependencies: npm install
Copy .env.example to .env and configure
Start development: npm run dev
Build: npm run build
Start production: npm start

Environment Configuration (.env)
Database Configuration
DB_HOST: Database host (default: localhost)
DB_PORT: Database port (default: 3306)
DB_USERNAME: Database username
DB_PASSWORD: Database password
DB_DATABASE: Database name (default: notification_service)

Express Configuration
PORT: Express server port (default: 5003)
CORS Configuration
CORS_ORIGIN: Allowed CORS origin (default: http://localhost:5173)
CORS_METHODS: Allowed HTTP methods

Service Info
SERVICE_NAME: Service name (default: Notification Service)
SERVICE_VERSION: Service version (default: 1.0.0)
