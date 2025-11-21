/**
 * Defines the structure of the claims contained in a login token.
 * These claims include the user ID, session ID, issued at time, and expiration time. 
 */
export type LoginTokenClaims = {
  user_id: number;
  session_id: string;
  iat: number; // Issued at
  exp: number; // Expires at
};
