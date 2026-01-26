import axios, { AxiosInstance } from "axios";
import { IUserServiceClient } from "../../Domain/services/external-services/IUserServiceClient";
import { Result } from "../../Domain/types/Result";
import { ErrorCode } from "../../Domain/enums/ErrorCode";

export class UserServiceClient implements IUserServiceClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string = process.env.USER_SERVICE_API || 'http://localhost:6754/api/v1') {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 5000
        });
    }

    async getUserById(userId: number): Promise<Result<any>> {
        try {
            const response = await this.axiosInstance.get(`/users/${userId}`);
            return { success: true, data: response.data };
        } catch (error: any) {
            if (error.response?.status === 404) {
                return { success: false, code: ErrorCode.NOT_FOUND, error: error.message};
            }
            return { success: false, code: ErrorCode.INTERNAL_ERROR, error: error.message };
        }
    }

    async getUsersByIds(userIds: number[]): Promise<Result<any[]>> {
        try {
            if (userIds.length === 0) {
                return { success: true, data: [] };
            }

            const ids = userIds.join(",");
            const response = await this.axiosInstance.get(`/users/ids`, {
                params: { ids }
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, code: ErrorCode.INTERNAL_ERROR, error: error.message };
        }
    }

    async verifyUserExists(userId: number): Promise<boolean> {
        const result = await this.getUserById(userId);
        return result.success;
    }
}
