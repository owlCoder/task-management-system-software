import axios, { AxiosInstance } from "axios";
import { CreateFileDTO } from "../../Domain/DTOs/file/CreateFileDTO";
import { DownloadFileDTO } from "../../Domain/DTOs/file/DownloadFileDTO";
import { UploadedFileDTO } from "../../Domain/DTOs/file/UploadedFileDTO";
import { IGatewayFileService } from "../../Domain/services/file/IGatewayFileService";
import { Result } from "../../Domain/types/common/Result";
import { ErrorHandlingService } from "../common/ErrorHandlingService";
import { FileHandlingService } from "./FileHandlingService";

export class GatewayFileService implements IGatewayFileService {
    private static readonly serviceName: string = "File Service";
    private readonly fileClient: AxiosInstance;
    
    constructor(){
        const fileBaseURL = process.env.FILE_SERVICE_API;
        
        this.fileClient = axios.create({
            baseURL: fileBaseURL,
            timeout: 5000,
        });
    }

    async downloadFile(fileId: number): Promise<Result<DownloadFileDTO>> {
        try {
            const response = await this.fileClient.get(`/files/download/${fileId}`, {
                responseType: "arraybuffer"
            });
            const downloadFile = FileHandlingService.extractFromResponse(response);

            return {
                success: true,
                data: downloadFile
            };
        } catch(error){
            return ErrorHandlingService.handle(error, GatewayFileService.serviceName);
        }
    }

    async getFilesByAuthorId(authorId: number): Promise<Result<UploadedFileDTO[]>> {
        try {
            const response = await this.fileClient.get<UploadedFileDTO[]>(`/files/author/${authorId}`);

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return ErrorHandlingService.handle(error, GatewayFileService.serviceName);
        }
    }

    async getFileMetadata(fileId: number): Promise<Result<UploadedFileDTO>> {
        try {
            const response = await this.fileClient.get<UploadedFileDTO>(`/files/metadata/${fileId}`);

            return {
                success: true,
                data: response.data
            };
        } catch(error){
            return ErrorHandlingService.handle(error, GatewayFileService.serviceName);
        }
    }

    async uploadFile(fileData: CreateFileDTO): Promise<Result<UploadedFileDTO>> {
        try{
            const formData = FileHandlingService.generateFormData(fileData);
            const response = await this.fileClient.post<UploadedFileDTO>("/files/upload", formData);

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return ErrorHandlingService.handle(error, GatewayFileService.serviceName);
        }
    }

    async deleteFile(fileId: number): Promise<Result<boolean>> {
        try {
            const response = await this.fileClient.delete<boolean>(`/files/${fileId}`);

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return ErrorHandlingService.handle(error, GatewayFileService.serviceName)
        }
    }

}