import { AuthTokenClaims } from "./AuthTokenClaims";

export type AuthResponseType = {
    authenticated: boolean;
    userData?: AuthTokenClaims;
}