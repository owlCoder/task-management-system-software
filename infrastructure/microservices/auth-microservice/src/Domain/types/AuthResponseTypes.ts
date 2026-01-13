/**
 * Type definitions for authentication response objects
 * Provides strong typing instead of using 'any'
 */

export interface BaseAuthResponse {
  success: boolean;
  message: string;
}

// Modular token response with strategy-determined field names
export interface TokenAuthResponse extends BaseAuthResponse {
  // Dynamic token field determined by ITokenNamingStrategy
  // Can be "token", "siem-token", or any other name defined by strategy
  [tokenField: string]: string | boolean;
}

export interface OTPRequiredResponse extends BaseAuthResponse {
  otp_required: true;
  session: {
    session_id: string;
    user_id: number;
    iat: number;
    exp: number;
  };
}

export interface ErrorResponse extends BaseAuthResponse {
  success: false;
}

export type AuthResponse = TokenAuthResponse | OTPRequiredResponse | ErrorResponse;