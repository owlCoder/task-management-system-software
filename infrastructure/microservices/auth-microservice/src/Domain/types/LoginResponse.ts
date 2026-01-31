import { LoginTokenClaims } from "./LoginTokenClaims";

export type LoginFailReason = "INVALID_CREDENTIALS" | "ROLE_NOT_ALLOWED";
/**
 * Type representing the response of a login attempt.
 * Includes authentication status and optional user data.
 */
export type LoginResponseType = {
    authenticated: boolean;
    userData?: LoginTokenClaims;

    reason?: LoginFailReason;
    message?: string;
}