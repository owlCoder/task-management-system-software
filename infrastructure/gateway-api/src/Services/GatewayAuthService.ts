import axios, { AxiosInstance } from "axios";
import { LoginUserDTO } from "../Domain/DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { IGatewayAuthService } from "../Domain/services/IGatewayAuthService";
import { AuthResponseType } from "../Domain/types/AuthResponse";
import { BrowserDataDTO } from "../Domain/DTOs/BrowserDataDTO";
import { ErrorHandlingService } from "./ErrorHandlingService";
import { Result } from "../Domain/types/Result";

export class GatewayAuthService implements IGatewayAuthService {
    private readonly serviceName: string;
    private readonly authClient: AxiosInstance;

    constructor() {
        this.serviceName = "Auth Service";
        const authBaseURL = process.env.AUTH_SERVICE_API;

        this.authClient = axios.create({
            baseURL: authBaseURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async login(data: LoginUserDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>("/auth/login", data);
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
            return ErrorHandlingService.handle(error, this.serviceName);
        }
    }
    
    async register(data: RegistrationUserDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>("/auth/register", data);
            return { 
                success: true, 
                data: {
                    success: response.data.success,
                    token: response.data.token,
                    message: response.data.message
                }
            };
        } catch(error) {
            return ErrorHandlingService.handle(error, this.serviceName);
        }
    }

    async verifyOtp(browserData: BrowserDataDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>("/auth/verify-otp", browserData);
            return {
                success: true,
                data: {
                    success: response.data.success,
                    token: response.data.token,
                    message: response.data.message
                }
            };
        } catch(error) {
            return ErrorHandlingService.handle(error, this.serviceName);
        }
    }

}