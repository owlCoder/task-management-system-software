# Auth Microservice

<span style="color:red; font-size: larger;">**Important Note:** OTP codes are currently printed to the service terminal/console (for development) until the mailing microservice is implemented. This is a temporary measure for testing and will be replaced with proper email delivery.</span>

Small authentication microservice responsible for:
- User login (password verification + OTP session creation)
- OTP verification (session -> JWT token)
- User registration (creates user + returns registration token)

Core HTTP endpoints (locally mounted under `/api/v1`, public endpoints may differ):
- POST /auth/login — start login and receive OTP session info (see [`LoginUserDTO`](src/Domain/DTOs/LoginUserDTO.ts))
- POST /auth/register — register new user (see [`RegistrationUserDTO`](src/Domain/DTOs/RegistrationUserDTO.ts))
- POST /auth/verify-otp — verify OTP and receive JWT token (see [`BrowserData`](src/Domain/models/BrowserData.ts))

Tokens and types
- Successful OTP verification issues a JWT containing claims defined in [`AuthTokenClaims`](src/Domain/types/AuthTokenClaims.ts) (and mapped to client-side types).
- Login flows use [`LoginResponse`](src/Domain/types/LoginResponse.ts) and registration returns an `AuthResponse` (`src/Domain/types/AuthResponse.ts`).

Development notes
- OTP delivery: printed to console for now, which will be replaced with mailing integration once the mailing microservice has been made available.
- Login session map is in-memory (`Map`) and cleared periodically; production should use persistent/session store if needed.