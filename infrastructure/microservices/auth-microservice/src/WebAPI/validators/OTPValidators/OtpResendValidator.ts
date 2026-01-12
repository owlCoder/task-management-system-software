import { BrowserData } from "../../../Domain/models/BrowserData";
import { validateBaseOtpData } from "./BaseOtpValidator";

/**
 * Validator for OTP resend requests.
 * Validates session and user data required for resending OTP.
 */
export function validateOTPResendData(browserData: BrowserData): { success: boolean; message?: string } {
  return validateBaseOtpData(browserData);
}