# Gateway API

## Architecture
- **Domain Layer**: DTOs, Types, Enums, Interfaces (*classified by the name of the microservice*).
- **Infrastructure Layer**: Logger (pino + pino-pretty).
- **Middlewares Layer**: CORS Policy, Authentication, Authorization, Traffic Logging.
- **Services Layer**: Handles requests by passing them to the appropriate microservices (*classified by the name of the microservice*).
- **WebAPI Layer**: Controllers for HTTP request handling (*classified by the name of the microservice*).

## HTTP Endpoints
(Locally mounted under `/api/v1`)
- **Auth Microservice**
    - `POST /login`: Authenticate user and issue JWT.
    - `POST /verify-otp`: Verify one-time password for user authentication.
    - `POST /resend-otp`: Request for the new otp code.
- **User Microservice** (*Accessible to admin users only*)
    - `POST /users`: Create a new user.
    - `GET /users/:id`: Get details of a specific user.
    - `GET /users`: List all users.
    - `PUT /users/:id`: Update a specific user's details.
    - `DELETE /users/:id`: Delete a specific user.
    - `GET /user-roles/userCreation`: Get roles that are available for creation of a user.
- **File Microservice** (*Accessible to authenticated users*)
    - `GET /files/download/:fileId`: Download a specific file.
    - `GET /files/author/:authorId`: Retrieve files by a specific author.
    - `GET /files/metadata/:fileId`: Get metadata for a specific file.
    - `POST /files/upload`: Upload a new file.
    - `DELETE /files/:fileId`: Delete a specific file.
- **Project Microservice** (*Modifications available to project managers, preview available to project related roles*)
    - `GET /projects/:id`: Get specific project.
    - `POST /projects`: Create new project.
    - `PUT /projects/:id`: Update a specific project.
    - `DELETE /projects/:id`: Delete a specific project.
- **Task Microservice** (*Modifications available to project manager, preview available to project related roles*)
    - `GET /tasks/:taskId`: Get specific task.
    - `GET /tasks/sprints/:sprintId`: Get tasks for specific sprint.
    - `POST /tasks/sprints/:sprintId`: Add task to a specific sprint.
    - `POST /tasks/:taskId/comments`: Add comment to a specific task.
- **Notification Microservice** (*Accessible to authenticated users*)
    - `GET /notifications/:id`: Get a specific notification.
    - `GET /notifications/user/:userId`: Get a notifications of a specific user.
    - `GET /notifications/user/:userId/unread-count`: Get a number of the unread notifications for a specific user.
    - `PATCH /notifications/bulk/unread`: Mark multiple notifications as unread.
    - `PATCH /notifications/bulk/read`: Mark multiple notifications as read.
    - `PATCH /notifications/:id/read`: Mark specific notification as read.
    - `PATCH /notifications/:id/unread`: Mark specific notification as unread.
    - `DELETE /notifications/bulk`: Delete multiple notifications.
    - `DELETE /notifications/:id`: Delete a specific notification.

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