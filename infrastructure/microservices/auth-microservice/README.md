# Auth Microservice


**Important Note:** Email and OTP delivery are now fully implemented. If the email service is offline, user authentication will bypass OTP and issue JWT tokens directly. OTP codes are sent via email when the service is online; otherwise, login proceeds without OTP for seamless fallback.

A lightweight authentication microservice built with Node.js, TypeScript, and Express, following SOLID principles for maintainability. It handles user authentication and OTP-based login flows (with email delivery), with robust fallback mechanisms for external service dependencies.

## Features
- **Login with OTP**: Verifies credentials, generates OTP codes, and manages sessions. OTP codes are sent via email. If the email service is unavailable, login falls back to direct JWT issuance (no OTP required).
- **OTP Verification**: Validates OTP codes received via email against stored sessions and issues JWT tokens.
- **OTP Resend**: Allows resending OTP codes during the login session.
- **Health Monitoring**: Periodically checks the email service status and logs connectivity. Login flow adapts automatically based on email service availability.
- **Security**: Uses bcrypt for password hashing, JWT for tokens, and in-memory session management with expiration.

## Architecture
The microservice is structured into layers for separation of concerns:
- **Domain Layer**: Contains models, DTOs, types, and interfaces (e.g., `User`, `LoginUserDTO`, `IAuthService`).
- **Services Layer**: Core business logic, separated into dedicated classes:
  - `AuthService`: Handles authentication logic (login and OTP verification).
  - `EmailService`: Manages OTP generation, email sending, and health checks.
  - `SessionService`: Stores and manages login sessions with automatic expiration.
  - `RoleService`: Caches and refreshes user roles from the database.
- **WebAPI Layer**: Controllers and validators for HTTP request handling (e.g., `AuthController`).
- **Database Layer**: TypeORM-based connection and initialization.

## Core HTTP Endpoints
(Locally mounted under `/api/v1`; public endpoints may differ based on gateway configuration.)
- `POST /auth/login` — Authenticates user credentials, checks email service health, and returns session info (OTP required if email service is online) or JWT token (direct login if email service is offline). Payload: [`LoginUserDTO`](src/Domain/DTOs/LoginUserDTO.ts).
- `POST /auth/verify-OTP` — Verifies OTP code (sent via email) and issues a JWT token. Payload: [`BrowserData`](src/Domain/models/BrowserData.ts).
- `POST /auth/resend-OTP` — Resends OTP code for the current login session. Payload: [`BrowserData`](src/Domain/models/BrowserData.ts).

## Tokens and Types
- **JWT Tokens**: Issued on successful direct login (when email is down) or OTP verification. Contains claims defined in [`AuthTokenClaims`](src/Domain/types/AuthTokenClaims.ts).
- **Login Session Tokens**: For OTP flows, a `session_id` is returned for client-side OTP submission.
- **Response Types**:
  - Login: [`LoginResponse`](src/Domain/types/LoginResponse.ts) (varies based on OTP requirement).
  - OTP Verification: [`AuthResponse`](src/Domain/types/AuthResponse.ts).

## Development Notes
- **OTP Delivery**: OTP codes are now sent via email using the mailing microservice. If the email service is offline, login does not require OTP and issues JWT tokens directly.
- **Login Session Management**: Uses an in-memory `Map` with periodic cleanup. Session management adapts to email service status for OTP or direct login.
- **Health Checks**: `EmailService` performs periodic checks (every 60 seconds) and logs status in color (yellow for connected, red for unavailable). Login flow automatically falls back to direct JWT if email service is down (no OTP required).
- **Testing**: Use unit tests for services (e.g., mock `EmailService` for health checks). Load-test login endpoints to verify fallback behavior.
- **Security**: Ensure `JWT_SECRET` is strong and rotated. Monitor logs for health check failures. Never commit `.env` to version control.

## Setup and Running
1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env` and set environment variables (see .env Configuration section below).
3. Run database migrations if needed (via TypeORM).
4. Start the service: `npm start` (or `npm run dev` for development).
5. Access endpoints via your API gateway or directly at `http://localhost:<port>/api/v1/auth/*`.

## Environment Configuration (.env)
Configure the following in your `.env` file. Defaults are provided where applicable.

### Database Configuration
- `DB_HOST`: Database host.
- `DB_PORT`: Database port.
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.
- `DB_NAME`: Database name.
- `DB_SSL_MODE`: SSL mode for database connection.

### Express Configuration
- `PORT`: Port for the Express server.

### Mail Service Configuration
- `MAIL_SERVICE_HOST`: Host for the mailing microservice.
- `MAIL_SERVICE_PORT`: Port for the mailing microservice.
- `MAIL_SERVICE_PATH`: Path for the mailing microservice API (default: /api/v1/MailService).

### JWT Configuration
- `JWT_SECRET`: Secret key for JWT signing (required; keep secure and rotate regularly).
- `JWT_SESSION_EXPIRATION_MINUTES`: JWT token expiration in minutes (by specification: 30).

### Password Security
- `SALT_ROUNDS`: Number of salt rounds for bcrypt hashing.

### CORS Configuration
- `CORS_ORIGIN`: Allowed origin for CORS.
- `CORS_METHODS`: Allowed HTTP methods for CORS.

### Auth Service Configuration
- `USER_ROLES_REFRESH_INTERVAL_MINUTES`: Interval in minutes to refresh user roles cache (default: 10).
- `LOGIN_SESSION_EXPIRATION_MINUTES`: Expiration in minutes for OTP sessions (by specification: 5).