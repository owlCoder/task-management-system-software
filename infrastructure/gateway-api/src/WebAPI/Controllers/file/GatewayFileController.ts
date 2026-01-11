// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayFileService } from "../../../Domain/services/file/IGatewayFileService";
import { UploadedFileDTO } from "../../../Domain/DTOs/file/UploadedFileDTO";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";

// Utils
import { handleDownloadResponse, handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";
import { parseOptionalInt } from "../../Utils/Query/QueryUtils";

/**
 * Routes client requests towards the File Microservice.
 */
export class GatewayFileController {
    private router: Router;

    constructor(private gatewayFileService: IGatewayFileService) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for File Microservice.
     */
    private initializeRoutes(){
        this.router.get("/files/download/:fileId", authenticate, this.downloadFile.bind(this));
        this.router.get("/files/author/:authorId", authenticate, this.getFilesByAuthorId.bind(this));
        this.router.get("/files/metadata/:fileId", authenticate, this.getFileMetadata.bind(this));
        this.router.post("/files/upload", authenticate, this.uploadFile.bind(this));
        this.router.delete("/files/:fileId", authenticate, this.deleteFile.bind(this));
    }

    /**
     * GET /api/v1/files/download/:fileId
     * @param {Request} req - the request object, containing the id of the file in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: file data stream.
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async downloadFile(req: Request, res: Response): Promise<void> {
        const fileId = parseInt(req.params.fileId as string, 10);

        const result = await this.gatewayFileService.downloadFile(fileId);
        handleDownloadResponse(res, result);
    }

    /**
     * GET /api/v1/files/author/:authorId
     * @param {Request} req - the request object, containing the id of the author in params and optional offset/limit in query.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link UploadedFileDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getFilesByAuthorId(req: Request, res: Response): Promise<void> {
        const authorId = parseInt(req.params.authorId as string, 10);
        const offset = parseOptionalInt(req.query.offset);
        const limit = parseOptionalInt(req.query.limit);

        const result = await this.gatewayFileService.getFilesByAuthorId(authorId, { offset, limit });
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/files/metadata/:fileId
     * @param {Request} req - the request object, containing the id of the file in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link UploadedFileDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getFileMetadata(req: Request, res: Response): Promise<void> {
        const fileId = parseInt(req.params.fileId as string, 10);

        const result = await this.gatewayFileService.getFileMetadata(fileId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/files/upload
     * @param {Request} req - the request object, containing the file data and author id.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link UploadedFileDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async uploadFile(req: Request, res: Response): Promise<void> {
        if(!req.headers['content-type']?.includes('multipart/form-data')){
            res.status(400).json({ message: "Bad request" });
            return;
        }
        
        const result = await this.gatewayFileService.uploadFile(req);
        handleResponse(res, result, 201);
    }

    /**
     * DELETE /api/v1/files/:fileId
     * @param {Request} req - the request object, containing the id of the file in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async deleteFile(req: Request, res: Response): Promise<void> {
        const fileId = parseInt(req.params.fileId as string, 10);

        const result = await this.gatewayFileService.deleteFile(fileId);
        handleEmptyResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
}