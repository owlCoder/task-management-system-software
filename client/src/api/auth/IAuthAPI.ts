import { GoogleLoginRequest } from "../../models/auth/GoogleUserInfo";
import { LoginUserDTO } from "../../models/auth/LoginUserDTO";
import { RegistrationUserDTO } from "../../models/auth/RegistrationUserDTO";
import { AuthResponseType } from "../../types/AuthResponseType";
import { VerifyOtpDTO, ResendOtpDTO } from "../../models/auth/OtpDTO";

export interface IAuthAPI {
  login(data: LoginUserDTO): Promise<AuthResponseType>;
  register(data: RegistrationUserDTO): Promise<AuthResponseType>;
  googleLogin(data: GoogleLoginRequest): Promise<AuthResponseType>;
  verifyOtp(data: VerifyOtpDTO): Promise<AuthResponseType>;
  resendOtp(data: ResendOtpDTO): Promise<AuthResponseType>;
}