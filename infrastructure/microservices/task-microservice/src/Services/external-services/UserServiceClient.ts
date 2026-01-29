import axios, { AxiosError, AxiosInstance } from "axios";
import { IUserServiceClient } from "../../Domain/services/external-services/IUserServiceClient";
import { Result } from "../../Domain/types/Result";
import { ErrorCode } from "../../Domain/enums/ErrorCode";
import { UserDTO } from "../../Domain/external-dtos/UserDTO";

export class UserServiceClient implements IUserServiceClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string = process.env.USER_SERVICE_API || 'http://localhost:6754/api/v1') {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 5000
        });
    }

    async getUserById(userId: number): Promise<Result<UserDTO>> {
        try {
            const response = await this.axiosInstance.get<UserDTO>(`/users/${userId}`);
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                return { success: false, errorCode: ErrorCode.USER_NOT_FOUND, message: "User not found" };
            }
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to fetch user" };
        }
    }

    async verifyUserExists(userId: number): Promise<boolean> {
        const result = await this.getUserById(userId);
        return result.success;
    }
}