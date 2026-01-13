import { BrowserData } from "../../Domain/models/BrowserData";

export function validateOtpVerificationData(browserData: BrowserData, otp: string): { success: boolean; message?: string } {
  if (!browserData.session_id || typeof browserData.session_id !== 'string' || browserData.session_id.trim().length === 0) {
    return { success: false, message: "Invalid session ID" };
  }
  if (!browserData.user_id || browserData.user_id <= 0) {
    return { success: false, message: "Invalid user ID" };
  }
  if (!otp || typeof otp !== 'string' || otp.length !== 8 || !/^\d{8}$/.test(otp)) {
    return { success: false, message: "OTP must be exactly 8 digits" };
  }
  return { success: true };
}
