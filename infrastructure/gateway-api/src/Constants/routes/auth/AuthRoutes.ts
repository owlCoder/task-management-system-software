export const AUTH_ROUTES = Object.freeze({
    LOGIN: "/auth/login",
    SIEM_LOGIN: "/auth/siem/login",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    GOOGLE_OAUTH: "/auth/google-login"
} as const);