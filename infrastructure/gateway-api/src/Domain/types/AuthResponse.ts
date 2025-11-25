import { OtpRequestType } from "./OtpRequest";

export type AuthResponseType = {
    success: boolean;
    otp_required?: boolean;
    session?: OtpRequestType;
    token?: string;
    message?: string;
};