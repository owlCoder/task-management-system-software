import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../DTOs/RegistrationUserDTO";
import { BrowserData } from "../models/BrowserData";
import { AuthResponseType } from "../types/AuthResponse";
import { LoginResponseType } from "../types/LoginResponse";

export interface IAuthService {
  login(data: LoginUserDTO): Promise<LoginResponseType>;
  verifyOtp(browserData: BrowserData, otp: string): Promise<AuthResponseType>;
  register(data: RegistrationUserDTO): Promise<AuthResponseType>;
}
