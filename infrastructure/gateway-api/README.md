# Gateway API

## Architecture
- **Domain Layer**: DTOs, Types, Enums, Interfaces (*classified by the name of the microservice*).
- **Infrastructure Layer**: Logger (pino + pino-pretty), API Call Handlers (axios).
- **Middlewares Layer**: CORS Policy, Traffic Logging, JSON Parser Handler, Authentication, Authorization, Global Error Handler.
- **Services Layer**: Handles requests by passing them to the appropriate microservices (*classified by the name of the microservice*).
- **WebAPI Layer**: Controllers for HTTP request handling (*classified by the name of the microservice*).

## HTTP Endpoints
- **Health**
    - `GET /health`: Get health status of the gateway.

(Locally mounted under `/api/v1`)
- **Auth Microservice**
    - `POST /login`: Authenticate user and issue JWT.
    - `POST /verify-otp`: Verify one-time password for user authentication.
    - `POST /resend-otp`: Request for the new otp code.
- **User Microservice** (*Accessible to administrators only*)
    - `POST /users`: Create a new user.
    - `GET /users/:userId`: Get details of a specific user.
    - `GET /users`: List all users.
    - `PUT /users/:userId`: Update a specific user's details.
    - `DELETE /users/:userId`: Delete a specific user.
    - `GET /user-roles/:impactLevel`: Get roles with greater impact level.
- **File Microservice** (*Accessible to authenticated users*)
    - `GET /files/download/:fileId`: Download a specific file.
    - `GET /files/author/:authorId`: Retrieve files by a specific author.
    - `GET /files/metadata/:fileId`: Get metadata for a specific file.
    - `POST /files/upload`: Upload a new file.
    - `DELETE /files/:fileId`: Delete a specific file.
- **Project Microservice** (*Modifications available to project managers, preview available to project related roles*)
    - `GET /projects/:projectId`: Get specific project.
    - `GET /users/:userId/projects`: Get projects that specific user is assigned to.
    - `POST /projects`: Create new project.
    - `PUT /projects/:projectId`: Update specific project.
    - `DELETE /projects/:projectId`: Delete a specific project.
    - `GET /projects/:projectId/sprints`: Get sprints of a specific project.
    - `GET /sprints/:sprintId`: Get specific sprint.
    - `POST /projects/:projectId/sprints`: Add sprint to specific project.
    - `PUT /sprints/:sprintId`: Update specific sprint.
    - `DELETE /sprints/:sprintId`: Delete specific sprint.
    - `GET /projects/:projectId/users`: Get users assigned to a specific project.
    - `POST /projects/:projectId/users`: Assign user to a specific project.
    - `DELETE /projects/:projectId/users/:userId`: Remove user from a specific project.
- **Task Microservice** (*Modifications available to project manager, preview available to project related roles*)
    - `GET /tasks/:taskId`: Get specific task.
    - `GET /tasks/sprints/:sprintId`: Get tasks for specific sprint.
    - `PUT /tasks/:taskId`: Update a specific task.
    - `DELETE /tasks/:taskId`: Delete a specific task.
    - `POST /tasks/sprints/:sprintId`: Add task to a specific sprint.
    - `POST /tasks/:taskId/comments`: Add comment to a specific task.
    - `DELETE /comments/:commentId`: Delete a specific comment.
- **Notification Microservice** (*Accessible to authenticated users*)
    - `GET /notifications/:notificationId`: Get a specific notification.
    - `GET /notifications/user/:userId`: Get a notifications of a specific user.
    - `GET /notifications/user/:userId/unread-count`: Get a number of the unread notifications for a specific user.
    - `POST /notifications`: Create a new notification.
    - `PATCH /notifications/bulk/unread`: Mark multiple notifications as unread.
    - `PATCH /notifications/bulk/read`: Mark multiple notifications as read.
    - `PATCH /notifications/:notificationId/read`: Mark specific notification as read.
    - `PATCH /notifications/:notificationId/unread`: Mark specific notification as unread.
    - `DELETE /notifications/bulk`: Delete multiple notifications.
    - `DELETE /notifications/:notificationId`: Delete a specific notification.
- **Analytics Microservice** (*Accessible to Analytics & Development Managers*)
    - `GET /analytics/burndown/:sprintId`: Get burndown analytics of a specific sprint.
    - `GET /analytics/burnup/:sprintId`: Get burnup analytics of a specific sprint.
    - `GET /analytics/velocity/:projectId`: Get velocity analytics of a specific project.
    - `GET /analytics/budget/:projectId`: Get budget analytics of a specific project.
    - `GET /analytics/resource-cost/:projectId`: Get resource cost analytics of a specific project.
    - `GET /analytics/profit-margin/:projectId`: Get profit margin analytics of a specific project.

## Setup and Running
1. Install dependencies: `npm install`.
2. Set environment variables in `.env` (see .env Configuration section below).
3. Start the service: `npm start` (or `npm run dev` for development).

## Environment Configuration (.env)
Configure the following in your `.env` file. Defaults are provided where applicable.

### Express Configuration
- `PORT`: Port for the Express server.

### JWT Configuration
- `JWT_SECRET`: Secret key for JWT signing (required; keep secure and rotate regularly).

### CORS Configuration
- `CORS_ORIGIN`: Allowed origin for CORS.
- `CORS_METHODS`: Allowed HTTP methods for CORS.

### Microservices endpoints
- `AUTH_SERVICE_API`: Endpoint of the authentication microservice.
- `USER_SERVICE_API`: Endpoint of the user microservice.
- `FILE_SERVICE_API`: Endpoint of the file microservice.
- `PROJECT_SERVICE_API`: Endpoint of the project microservice.
- `TASK_SERVICE_API`: Endpoint of the task microservice.
- `NOTIFICATION_SERVICE_API`: Endpoint of the notification microservice.
- `ANALYTICS_SERVICE_API`: Endpoint of the analytics microservice.