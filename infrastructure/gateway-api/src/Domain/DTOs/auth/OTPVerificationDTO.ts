export interface OTPVerificationDTO {
    session_id: string;
    user_id: number;
    otp : string;
}