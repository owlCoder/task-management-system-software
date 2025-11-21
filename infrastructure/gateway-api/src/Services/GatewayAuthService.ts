import axios, { AxiosInstance } from "axios";
import { LoginUserDTO } from "../Domain/DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { IGatewayAuthService } from "../Domain/services/IGatewayAuthService";
import { AuthResponseType } from "../Domain/types/AuthResponse";
import { BrowserDataDTO } from "../Domain/DTOs/BrowserDataDTO";

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

    async login(data: LoginUserDTO): Promise<AuthResponseType> {
        try {
            const response = await this.authClient.post<AuthResponseType>("/auth/login", data);
            return response.data;
        } catch {
            return { authenificated: false };
        }
    }
    
    async register(data: RegistrationUserDTO): Promise<AuthResponseType> {
        try {
            const response = await this.authClient.post<AuthResponseType>("/auth/register", data);
            return response.data;
        } catch {
            return { authenificated: false };
        }
    }

    async verifyOtp(browserData: BrowserDataDTO): Promise<AuthResponseType> {
        try {
            const response = await this.authClient.post<AuthResponseType>("/auth/verify-otp", browserData);
            return response.data;
        } catch {
            return { authenificated: false };
        }
    }

}