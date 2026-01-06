import { BrowserDataDTO } from "../../DTOs/auth/BrowserDataDTO";
import { LoginUserDTO } from "../../DTOs/auth/LoginUserDTO";
import { OTPVerificationDTO } from "../../DTOs/auth/OTPVerificationDTO";
import { AuthResponseType } from "../../types/auth/AuthResponse";
import { Result } from "../../types/common/Result";

export interface IGatewayAuthService {
    login(data: LoginUserDTO): Promise<Result<AuthResponseType>>;
    verifyOtp(data: OTPVerificationDTO): Promise<Result<AuthResponseType>>;
    resendOtp(data: BrowserDataDTO): Promise<Result<AuthResponseType>>;
}