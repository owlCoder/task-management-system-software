export interface OtpSessionDTO {
  session_id: string;
  user_id: number;
  iat: number;
  exp: number;
}

export interface VerifyOtpDTO extends OtpSessionDTO {
  otp: string; 
}

export interface ResendOtpDTO {
  user_id: number;
  session_id: string;
}