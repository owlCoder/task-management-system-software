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
import { generateFileFormData } from "./utils/GenerateData";
import { extractDownloadDTOFromResponse } from "./utils/ExtractData";

// Constants
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { FILE_ROUTES } from "../../Constants/routes/file/FileRoutes";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall, makeAPICallWithTransform } from "../../Infrastructure/axios/APIHelpers";

/**
 * Makes API requests to the File Microservice.
 */
export class GatewayFileService implements IGatewayFileService {
    private readonly fileClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        this.fileClient = axios.create({
            baseURL: API_ENDPOINTS.FILE,
            timeout: 5000,
        });
    }

    /**
     * Fetches the file from file microservice.
     * @param {number} fileId - id of the file. 
     * @returns {Promise<Result<DownloadFileDTO>>} - A promise that resolves to a Result object containing the file content and metadata
     * - On success returns data as {@link DownloadFileDTO}.
     * - On failure returns status code and error message.
     */
    async downloadFile(fileId: number): Promise<Result<DownloadFileDTO>> {
        return await makeAPICallWithTransform<DownloadFileDTO>(this.fileClient, this.errorHandlingService, {
            serviceName: SERVICES.FILE,
            method: HTTP_METHODS.GET,
            url: FILE_ROUTES.DOWNLOAD_FILE(fileId),
            responseType: "arraybuffer",
            timeout: 10000
        }, extractDownloadDTOFromResponse);
    }

    /**
     * Fetches the metadata of all files created by certain author.
     * @param {number} authorId - id of the author. 
     * @returns {Promise<Result<UploadedFileDTO[]>>} - A promise that resolves to a Result object containing the list of file metadata.
     * - On success returns data as {@link UploadedFileDTO[]}.
     * - On failure returns status code and error message.
     */
    async getFilesByAuthorId(authorId: number): Promise<Result<UploadedFileDTO[]>> {
        return await makeAPICall<UploadedFileDTO[]>(this.fileClient, this.errorHandlingService, {
            serviceName: SERVICES.FILE,
            method: HTTP_METHODS.GET,
            url: FILE_ROUTES.GET_FILES_FROM_AUTHOR(authorId)
        });
    }

    /**
     * Fetches the metadata of a certain file.
     * @param {number} fileId - id of the file. 
     * @returns {Promise<Result<UploadedFileDTO>>} - A promise that resolves to a Result object containing the of file metadata.
     * - On success returns data as {@link UploadedFileDTO}.
     * - On failure returns status code and error message.
     */
    async getFileMetadata(fileId: number): Promise<Result<UploadedFileDTO>> {
        return await makeAPICall<UploadedFileDTO>(this.fileClient, this.errorHandlingService, {
            serviceName: SERVICES.FILE,
            method: HTTP_METHODS.GET,
            url: FILE_ROUTES.GET_FILE_METADATA(fileId)
        });
    }

    /**
     * Uploads a file to file microservice.
     * @param {CreateFileDTO} fileData - file metadata and content. 
     * @returns {Promise<Result<UploadedFileDTO>>} - A promise that resolves to a Result object containing the file metadata.
     * - On success returns data as {@link UploadedFileDTO}.
     * - On failure returns status code and error message.
     */
    async uploadFile(fileData: CreateFileDTO): Promise<Result<UploadedFileDTO>> {
        const formData = generateFileFormData(fileData);
        
        return await makeAPICall<UploadedFileDTO, FormData>(this.fileClient, this.errorHandlingService, {
            serviceName: SERVICES.FILE,
            method: HTTP_METHODS.POST,
            url: FILE_ROUTES.UPLOAD_FILE,
            data: formData,
            timeout: 10000
        });
    }

    /**
     * Requests the deletion of a certain file.
     * @param {number} fileId - id of the file. 
     * @returns {Promise<Result<void>>} - A promise that resolves to a Result object.
     * - On success returns void.
     * - On failure returns status code and error message.
     */
    async deleteFile(fileId: number): Promise<Result<void>> {
        return await makeAPICall<void>(this.fileClient, this.errorHandlingService, {
            serviceName: SERVICES.FILE,
            method: HTTP_METHODS.DELETE,
            url: FILE_ROUTES.DELETE_FILE(fileId),
        });
    }

}