import { BrowserDataDTO } from "../DTOs/BrowserDataDTO";
import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../DTOs/RegistrationUserDTO";
import { AuthResponseType } from "../types/AuthResponse";

export interface IGatewayAuthService {
    login(data: LoginUserDTO): Promise<AuthResponseType>;
    register(data: RegistrationUserDTO): Promise<AuthResponseType>;
    verifyOtp(browserData: BrowserDataDTO): Promise<AuthResponseType>;
}