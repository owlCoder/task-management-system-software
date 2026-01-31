import axios, { AxiosInstance } from "axios";
import { LoginUserDTO } from "../../models/auth/LoginUserDTO";
import { RegistrationUserDTO } from "../../models/auth/RegistrationUserDTO";
import { IAuthAPI } from "./IAuthAPI";
import { AuthResponseType } from "../../types/AuthResponseType";
import { GoogleLoginRequest } from "../../models/auth/GoogleUserInfo";
import { VerifyOtpDTO, ResendOtpDTO } from "../../models/auth/OtpDTO";

export class AuthAPI implements IAuthAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  async verifyOtp(data: VerifyOtpDTO): Promise<AuthResponseType> {
    try {
      return (await this.axiosInstance.post("/verify-otp", data)).data;
    } catch (error) {
      console.error("Error during OTP verify:", error);
      throw error;
    }
  }

  async resendOtp(data: ResendOtpDTO): Promise<AuthResponseType> {
    try {
      return (await this.axiosInstance.post("/resend-otp", data)).data;
    } catch (error) {
      console.error("Error during OTP resend:", error);
      throw error;
    }
  }


  async login(data: LoginUserDTO): Promise<AuthResponseType> {
    try {
      return (await this.axiosInstance.post("/login", data)).data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
  async googleLogin(data: GoogleLoginRequest): Promise<AuthResponseType> {
    try {
      return (await this.axiosInstance.post("/google-login", data)).data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async register(data: RegistrationUserDTO): Promise<AuthResponseType> {
    try {
      return (await this.axiosInstance.post("/register", data)).data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }
}
