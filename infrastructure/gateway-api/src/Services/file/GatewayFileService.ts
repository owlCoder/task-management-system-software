// Libraries
import axios, { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayFileService } from "../../Domain/services/file/IGatewayFileService";
import { CreateFileDTO } from "../../Domain/DTOs/file/CreateFileDTO";
import { DownloadFileDTO } from "../../Domain/DTOs/file/DownloadFileDTO";
import { UploadedFileDTO } from "../../Domain/DTOs/file/UploadedFileDTO";
import { Result } from "../../Domain/types/common/Result";

// Utils
import { extractDownloadDTOFromResponse, generateFormData } from "../../Utils/File/FileUtils";

// Constants
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { FILE_ROUTES } from "../../Constants/routes/file/FileRoutes";
import { SERVICES } from "../../Constants/services/Services";

export class GatewayFileService implements IGatewayFileService {
    private readonly fileClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        const fileBaseURL = process.env.FILE_SERVICE_API;
        
        this.fileClient = axios.create({
            baseURL: fileBaseURL,
            timeout: 5000,
        });
    }

    async downloadFile(fileId: number): Promise<Result<DownloadFileDTO>> {
        try {
            const response = await this.fileClient.get(FILE_ROUTES.DOWNLOAD(fileId), {
                responseType: "arraybuffer"
            });
            const downloadFile = extractDownloadDTOFromResponse(response);

            return {
                success: true,
                data: downloadFile
            };
        } catch(error){
            return this.errorHandlingService.handle(error, SERVICES.FILE, HTTP_METHODS.GET, FILE_ROUTES.DOWNLOAD(fileId));
        }
    }

    async getFilesByAuthorId(authorId: number): Promise<Result<UploadedFileDTO[]>> {
        try {
            const response = await this.fileClient.get<UploadedFileDTO[]>(FILE_ROUTES.GET_BY_AUTHOR(authorId));

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.FILE, HTTP_METHODS.GET, FILE_ROUTES.GET_BY_AUTHOR(authorId));
        }
    }

    async getFileMetadata(fileId: number): Promise<Result<UploadedFileDTO>> {
        try {
            const response = await this.fileClient.get<UploadedFileDTO>(FILE_ROUTES.METADATA(fileId));

            return {
                success: true,
                data: response.data
            };
        } catch(error){
            return this.errorHandlingService.handle(error, SERVICES.FILE, HTTP_METHODS.GET, FILE_ROUTES.METADATA(fileId));
        }
    }

    async uploadFile(fileData: CreateFileDTO): Promise<Result<UploadedFileDTO>> {
        try{
            const formData = generateFormData(fileData);
            const response = await this.fileClient.post<UploadedFileDTO>(FILE_ROUTES.UPLOAD, formData);

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.FILE, HTTP_METHODS.POST, FILE_ROUTES.UPLOAD);
        }
    }

    async deleteFile(fileId: number): Promise<Result<boolean>> {
        try {
            const response = await this.fileClient.delete<boolean>(FILE_ROUTES.DELETE(fileId));

            return {
                success: true,
                data: response.data
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.FILE, HTTP_METHODS.DELETE, FILE_ROUTES.DELETE(fileId))
        }
    }

}