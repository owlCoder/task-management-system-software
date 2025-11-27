/**
 * Defines the structure of the claims contained in a login token.
 * Either session fields are present (for OTP-required login) or user fields are present (for direct login).
 */

type SessionClaims = {
  user_id: number;
  otp_required: true;
  session_id: string;
  iat: number; // Issued at
  exp: number; // Expires at
};

type UserClaims = {
  user_id: number;
  otp_required: false;
  username: string;
  role: string;
};

export type LoginTokenClaims = SessionClaims | UserClaims;