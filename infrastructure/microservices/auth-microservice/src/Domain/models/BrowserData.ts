/**
 * BrowserData interface represents the data related to a user's browser session.
 * This will be used for OTP verification and the login process.
 */
export interface BrowserData {
    session_id: string;
    user_id: number;
}