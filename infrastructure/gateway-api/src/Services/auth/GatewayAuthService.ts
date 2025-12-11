import axios, { AxiosInstance } from "axios";
import { LoginUserDTO } from "../../Domain/DTOs/auth/LoginUserDTO";
import { RegistrationUserDTO } from "../../Domain/DTOs/auth/RegistrationUserDTO";
import { IGatewayAuthService } from "../../Domain/services/auth/IGatewayAuthService";
import { AuthResponseType } from "../../Domain/types/auth/AuthResponse";
import { BrowserDataDTO } from "../../Domain/DTOs/auth/BrowserDataDTO";
import { Result } from "../../Domain/types/common/Result";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { AUTH_ROUTES } from "../../Constants/routes/auth/AuthRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { OTPVerificationDTO } from "../../Domain/DTOs/auth/OTPVerificationDTO";

export class GatewayAuthService implements IGatewayAuthService {
    private static readonly serviceName: string = "Auth Service";
    private readonly authClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        const authBaseURL = process.env.AUTH_SERVICE_API;

        this.authClient = axios.create({
            baseURL: authBaseURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async login(data: LoginUserDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.LOGIN, data);

            return {
                success: true,
                data: {
                    success: response.data.success,
                    otp_required: response.data.otp_required,
                    session: response.data.otp_required ? response.data.session : undefined,
                    token: !response.data.otp_required ? response.data.token : undefined,
                    message: response.data.message
                }
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, GatewayAuthService.serviceName, HTTP_METHODS.POST, AUTH_ROUTES.LOGIN);
        }
    }
    
    async register(data: RegistrationUserDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.REGISTER, data);

            return { 
                success: true, 
                data: {
                    success: response.data.success,
                    token: response.data.token,
                    message: response.data.message
                }
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, GatewayAuthService.serviceName, HTTP_METHODS.POST, AUTH_ROUTES.REGISTER);
        }
    }

    async verifyOtp(otpData: OTPVerificationDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.VERIFY_OTP, otpData);

            return {
                success: true,
                data: {
                    success: response.data.success,
                    token: response.data.token,
                    message: response.data.message
                }
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, GatewayAuthService.serviceName, HTTP_METHODS.POST, AUTH_ROUTES.VERIFY_OTP);
        }
    }

    async resendOtp(browserData: BrowserDataDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.RESEND_OTP, browserData);

            return {
                success: true,
                data: {
                    success: response.data.success,
                    otp_required: response.data.otp_required,
                    session: response.data.otp_required ? response.data.session : undefined,
                    token: !response.data.otp_required ? response.data.token : undefined,
                    message: response.data.message
                }
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, GatewayAuthService.serviceName, HTTP_METHODS.POST, AUTH_ROUTES.RESEND_OTP);
        }
    }

}