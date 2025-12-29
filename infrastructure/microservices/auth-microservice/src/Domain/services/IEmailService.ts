import { User } from "../models/User";

export interface IEmailService {
  isAvailable: boolean;
  sendOTPCode(user: User, otpCode: string): Promise<boolean>;
}