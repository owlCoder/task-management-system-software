import { LoginTokenClaims } from "./LoginTokenClaims";

/**
 * Type representing the response of a login attempt.
 * Includes authentication status and optional user data.
 */
export type LoginResponseType = {
    authenticated: boolean;
    userData?: LoginTokenClaims;
}