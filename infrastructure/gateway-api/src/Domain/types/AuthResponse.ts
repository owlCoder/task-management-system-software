import { AuthTokenClaimsType } from "./AuthTokenClaims";

export type AuthResponseType = {
    authenticated: boolean;
    userData?: AuthTokenClaimsType;
}