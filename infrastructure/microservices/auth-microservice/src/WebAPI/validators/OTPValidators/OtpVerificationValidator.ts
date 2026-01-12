import { BrowserData } from "../../../Domain/models/BrowserData";
import { validateBaseOtpData } from "./BaseOtpValidator";

/**
 * Validator for OTP verification requests.
 * Extends base OTP validation with OTP code validation.
 */
export function validateOTPVerificationData(browserData: BrowserData, otp: string): { success: boolean; message?: string } {
  // First validate the base data
  const baseValidation = validateBaseOtpData(browserData);
  if (!baseValidation.success) {
    return baseValidation;
  }

  // Then validate the OTP
  if (!otp || typeof otp !== 'string' || otp.length !== 8 || !/^\d{8}$/.test(otp)) {
    return { success: false, message: "OTP must be exactly 8 digits" };
  }

  return { success: true };
}