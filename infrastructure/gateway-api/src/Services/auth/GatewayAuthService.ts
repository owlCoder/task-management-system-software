import axios, { AxiosInstance } from "axios";
import { LoginUserDTO } from "../../Domain/DTOs/auth/LoginUserDTO";
import { RegistrationUserDTO } from "../../Domain/DTOs/auth/RegistrationUserDTO";
import { IGatewayAuthService } from "../../Domain/services/auth/IGatewayAuthService";
import { AuthResponseType } from "../../Domain/types/auth/AuthResponse";
import { BrowserDataDTO } from "../../Domain/DTOs/auth/BrowserDataDTO";
import { Result } from "../../Domain/types/common/Result";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { ILoggerService } from "../../Domain/services/common/ILoggerService";
import { AUTH_ROUTES } from "../../Constants/routes/auth/AuthRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";

export class GatewayAuthService implements IGatewayAuthService {
    private static readonly serviceName: string = "Auth Service";
    private readonly authClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService, private readonly loggerService: ILoggerService) {
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

            this.loggerService.info(
                GatewayAuthService.serviceName, 
                response.data.otp_required ?  "OTP_REQUIRED" : "LOGIN_SUCCESS", 
                AUTH_ROUTES.LOGIN,
                HTTP_METHODS.POST, 
                `Login ${response.data.otp_required ? 'requires OTP' : 'successful'} for user ${data.username}`
            );

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

            this.loggerService.info(
                GatewayAuthService.serviceName, 
                'USER_REGISTERED',
                AUTH_ROUTES.REGISTER, 
                HTTP_METHODS.POST, 
                `User registered: ${data.username}`
            );

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

    async verifyOtp(browserData: BrowserDataDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.VERIFY_OTP, browserData);
            
            this.loggerService.info(
                GatewayAuthService.serviceName, 
                'OTP_VERIFIED',
                AUTH_ROUTES.VERIFY_OTP, 
                HTTP_METHODS.POST, 
                `OTP verification successful for user with id ${browserData.user_id}`
            );

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

}