import { Router, Request, Response } from "express";
import { IGatewayFileService } from "../../Domain/services/file/IGatewayFileService";
import path from "path";
import multer, { Multer } from "multer";
import { UploadedFileDTO } from "../../Domain/DTOs/file/UploadedFileDTO";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";

export class GatewayFileController {
    private router: Router;
    private upload: Multer;

    constructor(private gatewayFileService: IGatewayFileService) {
        this.router = Router();
        this.upload = multer({ storage: multer.memoryStorage() })
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get("/files/download/:fileId", authenticate, this.downloadFile.bind(this));
        this.router.get("/files/author/:authorId", authenticate, this.getFilesByAuthorId.bind(this));
        this.router.get("/files/metadata/:fileId", authenticate, this.getFileMetadata.bind(this));
        this.router.post("/files/upload", authenticate, this.upload.single("file"), this.uploadFile.bind(this));
        this.router.delete("/files/:fileId", authenticate, this.deleteFile.bind(this));
    }

    /**
     * GET /api/v1/files/download/:fileId
     * @param {Request} req - the request object, containing the id of the file in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: Buffer of the file, content-type and content-disposition are in header of the response.
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async downloadFile(req: Request, res: Response): Promise<void> {
        const fileId = parseInt(req.params.fileId);

        const result = await this.gatewayFileService.downloadFile(fileId);
        if(result.success){
            res.setHeader("Content-Type", result.data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${result.data.fileName}"`);
            res.send(result.data.fileBuffer);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * GET /api/v1/files/author/:authorId
     * @param {Request} req - the request object, containing the id of the author in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link UploadedFileDTO[]} structure containing the list of files uploaded by author. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getFilesByAuthorId(req: Request, res: Response): Promise<void> {
        const authorId = parseInt(req.params.authorId);

        const result = await this.gatewayFileService.getFilesByAuthorId(authorId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * GET /api/v1/files/metadata/:fileId
     * @param {Request} req - the request object, containing the id of the file in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link UploadedFileDTO} structure containing the metadata of the file. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getFileMetadata(req: Request, res: Response): Promise<void> {
        const fileId = parseInt(req.params.fileId);

        const result = await this.gatewayFileService.getFileMetadata(fileId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * POST /api/v1/files/upload
     * @param {Request} req - the request object, containing the file and author id.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link UploadedFileDTO} containing the metadata of the uploaded file. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async uploadFile(req: Request, res: Response): Promise<void> {
        const file = req.file;
        const authorId = parseInt(req.body?.authorId);
        const originalFileName = req.file?.originalname ?? "";
        const fileExtension = path.extname(originalFileName);
        const fileType = req.file?.mimetype ?? "";

        const result = await this.gatewayFileService.uploadFile({
            originalFileName: originalFileName,
            fileType: fileType,
            fileExtension: fileExtension,
            authorId: authorId,
            fileBuffer: file?.buffer
        });

        if(result.success){
            res.status(201).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message});

    }

    /**
     * DELETE /api/v1/files/:fileId
     * @param {Request} req - the request object, containing the id of the file in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async deleteFile(req: Request, res: Response): Promise<void> {
        const fileId = parseInt(req.params.fileId);

        const result = await this.gatewayFileService.deleteFile(fileId);
        if(result.success){
            res.status(204).send();
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    public getRouter(): Router {
        return this.router;
    }
}