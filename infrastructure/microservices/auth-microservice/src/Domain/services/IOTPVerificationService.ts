import { BrowserData } from "../models/BrowserData";
import { LoginResponseType } from "../types/LoginResponse";
import { AuthResponseType } from "../types/AuthResponse";

export interface IOTPVerificationService {
  resendOTP(browserData: BrowserData): Promise<LoginResponseType>;
  verifyOTP(browserData: BrowserData, otp: string): Promise<AuthResponseType>;
}