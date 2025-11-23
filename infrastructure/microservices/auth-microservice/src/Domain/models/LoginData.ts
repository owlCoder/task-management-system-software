export interface LoginData {
  userId: number;
  otpCode: string;
  dateCreated: Date;
  retryCount: number;
}
