import { BrowserDataDTO } from "../DTOs/BrowserDataDTO";
import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../DTOs/RegistrationUserDTO";
import { AuthResponseType } from "../types/AuthResponse";
import { Result } from "../types/Result";

export interface IGatewayAuthService {
    login(data: LoginUserDTO): Promise<Result<AuthResponseType>>;
    register(data: RegistrationUserDTO): Promise<Result<AuthResponseType>>;
    verifyOtp(browserData: BrowserDataDTO): Promise<Result<AuthResponseType>>;
}