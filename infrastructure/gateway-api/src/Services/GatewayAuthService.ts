import axios, { AxiosInstance } from "axios";
import { LoginUserDTO } from "../Domain/DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { IGatewayAuthService } from "../Domain/services/IGatewayAuthService";
import { AuthResponseType } from "../Domain/types/AuthResponse";
import { BrowserDataDTO } from "../Domain/DTOs/BrowserDataDTO";
import { ErrorHandlingService } from "./ErrorHandlingService";
import { Result } from "../Domain/types/Result";

export class GatewayAuthService implements IGatewayAuthService {
    private readonly authClient: AxiosInstance;

    constructor() {
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
            return { success: true, data: response.data };
        } catch(error) {
            return ErrorHandlingService.handle(error, "Auth Service");
        }
    }
    
    async register(data: RegistrationUserDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>("/auth/register", data);
            return { success: true, data: response.data };
        } catch(error) {
            return ErrorHandlingService.handle(error, "Auth Service");
        }
    }

    async verifyOtp(browserData: BrowserDataDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>("/auth/verify-otp", browserData);
            return { success: true, data: response.data };
        } catch(error) {
            return ErrorHandlingService.handle(error, "Auth Service");
        }
    }

}