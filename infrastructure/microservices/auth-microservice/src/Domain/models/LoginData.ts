/**
 * LoginData interface representing the data required for user OTP verification (Login).
 */
export interface LoginData {
  userId: number;
  otpCode: string;
  dateCreated: Date;
}
