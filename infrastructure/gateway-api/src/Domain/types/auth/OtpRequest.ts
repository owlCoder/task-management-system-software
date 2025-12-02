export type OtpRequestType = {
    session_id: string;
    user_id: number;
    iat: number;
    exp: number;
}