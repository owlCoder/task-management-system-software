import axios, { AxiosInstance } from "axios";
import { IGatewayUserService } from "../Domain/services/IGatewayUserService";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { UserDTO } from "../Domain/DTOs/UserDTO";
import { Result } from "../Domain/types/Result";
import { ErrorHandlingService } from "./ErrorHandlingService";

export class GatewayUserService implements IGatewayUserService {
    private readonly serviceName: string;
    private readonly userClient: AxiosInstance;

    constructor() {
        this.serviceName = "User Service"
        const userBaseURL = process.env.USER_SERVICE_API;

        this.userClient = axios.create({
            baseURL: userBaseURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async createUser(data: RegistrationUserDTO): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.post<UserDTO>("users", data);
            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return ErrorHandlingService.handle(error, this.serviceName);
        }
    }

    async getUserById(id: number): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.get<UserDTO>(`/users/${id}`);
            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return ErrorHandlingService.handle(error, this.serviceName);
        }
    }

    async getUsers(): Promise<Result<UserDTO[]>> {
        try{
            const response = await this.userClient.get<UserDTO[]>("users");
            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return ErrorHandlingService.handle(error, this.serviceName);
        }
    }
}