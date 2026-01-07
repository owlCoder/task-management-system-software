import { Request } from "express";

// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayFileService } from "../../Domain/services/file/IGatewayFileService";
import { UploadedFileDTO } from "../../Domain/DTOs/file/UploadedFileDTO";
import { Result } from "../../Domain/types/common/Result";
import { StreamResponse } from "../../Domain/types/common/StreamResponse";

// Constants
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { FILE_ROUTES } from "../../Constants/routes/file/FileRoutes";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall, makeAPIDownloadStreamCall, makeAPIUploadStreamCall } from "../../Infrastructure/axios/APIHelpers";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";

/**
 * Makes API requests to the File Microservice.
 */
export class GatewayFileService implements IGatewayFileService {
    private readonly fileClient: AxiosInstance;
    
    constructor(private readonly errorHandlingService: IErrorHandlingService){
        this.fileClient = createAxiosClient(API_ENDPOINTS.FILE, { headers: {} });
    }

    /**
     * Downloads a file from the file microservice by its ID.
     * @param {number} fileId - id of the file.
     * @returns {Promise<Result<StreamResponse>>} A promise that resolves to a Result object containing:
     * - On success StreamResponse object containing the Readable stream and headers.
     * - On failure returns status code and error message.
     */
    async downloadFile(fileId: number): Promise<Result<StreamResponse>> {
        return await makeAPIDownloadStreamCall(this.fileClient, this.errorHandlingService, {
            serviceName: SERVICES.FILE,
            method: HTTP_METHODS.GET,
            url: FILE_ROUTES.DOWNLOAD_FILE(fileId),
            timeout: 20000
        });
    }

    /**
     * Fetches the metadata of all files created by certain author.
     * @param {number} authorId - id of the author. 
     * @param {number} offset - optional offset for pagination.
     * @param {number} limit - optional limit for pagination.
     * @returns {Promise<Result<UploadedFileDTO[]>>} - A promise that resolves to a Result object containing the list of file metadata.
     * - On success returns data as {@link UploadedFileDTO[]}.
     * - On failure returns status code and error message.
     */
    async getFilesByAuthorId(authorId: number, offset?: number, limit?: number): Promise<Result<UploadedFileDTO[]>> {
        let url = FILE_ROUTES.GET_FILES_FROM_AUTHOR(authorId);
        
        // Build query string for pagination parameters
        const queryParams = new URLSearchParams();
        if (offset !== undefined) {
            queryParams.append('offset', offset.toString());
        }
        if (limit !== undefined) {
            queryParams.append('limit', limit.toString());
        }
        
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }
        
        return await makeAPICall<UploadedFileDTO[]>(this.fileClient, this.errorHandlingService, {
            serviceName: SERVICES.FILE,
            method: HTTP_METHODS.GET,
            url: url
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
     * Passes through file data from the request.
     * @param {Request} req - The request object containing the file. 
     * @returns {Promise<Result<UploadedFileDTO>>} - A promise that resolves to a Result object containing the file metadata.
     * - On success returns data as {@link UploadedFileDTO}.
     * - On failure returns status code and error message.
     */
    async uploadFile(req: Request): Promise<Result<UploadedFileDTO>> {
        return await makeAPIUploadStreamCall<UploadedFileDTO, Request>(this.fileClient, this.errorHandlingService, {
            serviceName: SERVICES.FILE,
            method: HTTP_METHODS.POST,
            url: FILE_ROUTES.UPLOAD_FILE,
            data: req,
            headers: {
                'Content-Type': req.headers["content-type"]!,
                ...(req.user?.role && { 'x-user-role': req.user.role }),
                ...(req.headers["content-length"] && { 'Content-Length': req.headers["content-length"] })
            },
            timeout: 20000
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