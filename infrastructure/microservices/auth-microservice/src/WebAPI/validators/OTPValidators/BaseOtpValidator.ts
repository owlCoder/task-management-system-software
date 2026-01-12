import { BrowserData } from "../../../Domain/models/BrowserData";

/**
 * Base validator for OTP-related operations that require session and user validation.
 * This is the foundation for all OTP validators.
 */
export function validateBaseOtpData(browserData: BrowserData): { success: boolean; message?: string } {
  if (!browserData.session_id || typeof browserData.session_id !== 'string' || browserData.session_id.trim().length === 0) {
    return { success: false, message: "Invalid session ID" };
  }
  if (!browserData.user_id || browserData.user_id <= 0) {
    return { success: false, message: "Invalid user ID" };
  }
  return { success: true };
}