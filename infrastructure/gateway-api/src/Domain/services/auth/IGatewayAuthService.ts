import { BrowserDataDTO } from "../../DTOs/auth/BrowserDataDTO";
import { LoginUserDTO } from "../../DTOs/auth/LoginUserDTO";
import { OTPVerificationDTO } from "../../DTOs/auth/OTPVerificationDTO";
import { RegistrationUserDTO } from "../../DTOs/auth/RegistrationUserDTO";
import { AuthResponseType } from "../../types/auth/AuthResponse";
import { Result } from "../../types/common/Result";

export interface IGatewayAuthService {
    login(data: LoginUserDTO): Promise<Result<AuthResponseType>>;
    register(data: RegistrationUserDTO): Promise<Result<AuthResponseType>>;
    verifyOtp(otpData: OTPVerificationDTO): Promise<Result<AuthResponseType>>;
    resendOtp(browserData: BrowserDataDTO): Promise<Result<AuthResponseType>>;
}