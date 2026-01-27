import { IFileServiceClient } from "../../Domain/services/external-services/IFileServiceClient";
import axios, { AxiosInstance } from 'axios';
import { Result } from "../../Domain/types/Result";
import { ErrorCode } from '../../Domain/enums/ErrorCode';

export class FileServiceClient implements IFileServiceClient {
    private axiosInstance : AxiosInstance;

    constructor(baseURL: string = process.env.FILE_SERVICE_API || 'http://localhost:3303/api/v1') {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 5000
        });
    }

    async getFileMetaData(file_id: number): Promise<Result<any>> {
        try {
            const response = await this.axiosInstance.get(`/files/metadata/${file_id}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            console.log(error);
            if (error.response?.status === 404) {
                return { success: false, errorCode: ErrorCode.FILE_NOT_FOUND, message: "File not found" };
            }
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to fetch sprint" };
        }
    }
}