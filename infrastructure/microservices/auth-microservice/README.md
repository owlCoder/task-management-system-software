# Auth Microservice

**Important Note:** OTP codes are currently printed to the service terminal/console (for development) until the mailing microservice is implemented. This is a temporary measure for testing and will be replaced with proper email delivery.

A lightweight authentication microservice built with Node.js, TypeScript, and Express, following SOLID principles for maintainability. It handles user authentication, OTP-based login flows, and registration, with fallback mechanisms for external service dependencies.

## Features
- **User Registration**: Creates new users with role validation and password hashing.
- **Login with OTP**: Verifies credentials, generates OTP codes, and manages sessions. Falls back to direct JWT issuance if the email service is unavailable.
- **OTP Verification**: Validates OTP codes against stored sessions and issues JWT tokens.
- **Health Monitoring**: Periodically checks the email service status and logs connectivity.
- **Security**: Uses bcrypt for password hashing, JWT for tokens, and in-memory session management with expiration.

## Architecture
The microservice is structured into layers for separation of concerns:
- **Domain Layer**: Contains models, DTOs, types, and interfaces (e.g., `User`, `LoginUserDTO`, `IAuthService`).
- **Services Layer**: Core business logic, separated into dedicated classes:
  - `AuthService`: Handles authentication logic (login, register, verify OTP).
  - `EmailService`: Manages OTP generation, email sending, and health checks.
  - `SessionService`: Stores and manages login sessions with automatic expiration.
  - `RoleService`: Caches and refreshes user roles from the database.
- **WebAPI Layer**: Controllers and validators for HTTP request handling (e.g., `AuthController`).
- **Database Layer**: TypeORM-based connection and initialization.

## Core HTTP Endpoints
(Locally mounted under `/api/v1`; public endpoints may differ based on gateway configuration.)
- `POST /auth/login` — Authenticates user credentials, checks email service health, and returns session info (OTP required) or JWT token (direct login if email down). Payload: [`LoginUserDTO`](src/Domain/DTOs/LoginUserDTO.ts).
- `POST /auth/register` — Registers a new user and returns a JWT token. Payload: [`RegistrationUserDTO`](src/Domain/DTOs/RegistrationUserDTO.ts).
- `POST /auth/verify-otp` — Verifies OTP code and issues a JWT token. Payload: [`BrowserData`](src/Domain/models/BrowserData.ts).

## Tokens and Types
- **JWT Tokens**: Issued on successful registration, direct login (when email is down), or OTP verification. Contains claims defined in [`AuthTokenClaims`](src/Domain/types/AuthTokenClaims.ts).
- **Login Session Tokens**: For OTP flows, a `session_id` is returned for client-side OTP submission.
- **Response Types**:
  - Login: [`LoginResponse`](src/Domain/types/LoginResponse.ts) (varies based on OTP requirement).
  - Registration/OTP Verification: [`AuthResponse`](src/Domain/types/AuthResponse.ts).

## Development Notes
- **OTP Delivery**: Currently logs to console for testing. Integrate with the mailing microservice by updating `EmailService` to send real emails.
- **Login Session Management**: Uses an in-memory `Map` with periodic cleanup.
- **Health Checks**: `EmailService` performs periodic checks (every 60 seconds) and logs status in color (yellow for connected, red for unavailable). Login falls back to direct JWT if email is down.
- **Testing**: Use unit tests for services (e.g., mock `EmailService` for health checks). Load-test login endpoints to verify fallback behavior.
- **Security**: Ensure `JWT_SECRET` is strong and rotated. Monitor logs for health check failures. Never commit `.env` to version control.

## Setup and Running
1. Install dependencies: `npm install`.
2. Set environment variables in `.env` (see .env Configuration section below).
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