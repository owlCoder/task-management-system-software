import axios, { AxiosInstance } from "axios";
import { IGatewayUserService } from "../Domain/services/IGatewayUserService";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { UserDTO } from "../Domain/DTOs/UserDTO";
import { Result } from "../Domain/types/Result";
import { ErrorHandlingService } from "./ErrorHandlingService";

export class GatewayUserService implements IGatewayUserService {
    private static readonly serviceName: string = "User Service";
    private readonly userClient: AxiosInstance;

    constructor() {
        const userBaseURL = process.env.USER_SERVICE_API;

        this.userClient = axios.create({
            baseURL: userBaseURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async createUser(data: RegistrationUserDTO): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.post<UserDTO>("/users", data);
            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return ErrorHandlingService.handle(error, GatewayUserService.serviceName);
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
            return ErrorHandlingService.handle(error, GatewayUserService.serviceName);
        }
    }

    async getUsers(): Promise<Result<UserDTO[]>> {
        try{
            const response = await this.userClient.get<UserDTO[]>("/users");
            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return ErrorHandlingService.handle(error, GatewayUserService.serviceName);
        }
    }

    async updateUserById(id: number, data: UserDTO): Promise<Result<UserDTO>> {
        try {
            const response = await this.userClient.put<UserDTO>(`/users/${id}`, data);
            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return ErrorHandlingService.handle(error, GatewayUserService.serviceName)
        }
    }

    async logicallyDeleteUserById(id: number): Promise<Result<boolean>> {
        try {
            const response = await this.userClient.delete<boolean>(`/users/${id}`);
            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return ErrorHandlingService.handle(error, GatewayUserService.serviceName);
        }
    }

}