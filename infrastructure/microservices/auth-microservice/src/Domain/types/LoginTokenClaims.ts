/**
 * Defines the structure of the claims contained in a login token.
 * Either session fields are present (for OTP-required login) or user fields are present (for direct login).
 */

import { AuthTokenClaims } from "./AuthTokenClaims";

type SessionClaims = {
  user_id: number;
  otp_required: true;
  google_id_required: false;
  session_id: string;
  iat: number; // Issued at
  exp: number; // Expires at
};

type UserClaims = AuthTokenClaims & {
  otp_required: false;
  google_id_required: false;
};

type GoogleTokenClaims = {
  user_id: number;
  google_id_required: true;
  google_id: string;
  email: string;
  role: string;
  image_url?: string;
  otp_required: false;
  username: string;
};


export type LoginTokenClaims = SessionClaims | UserClaims | GoogleTokenClaims;