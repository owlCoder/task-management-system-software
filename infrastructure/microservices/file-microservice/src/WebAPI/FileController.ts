import { Request, Response, Router } from "express";
import multer from "multer";
import { IFileService } from "../Domain/services/IFileService";
import { CreateFileDTO } from "../Domain/DTOs/CreateFileDTO";
import { IRoleValidationService } from "../Domain/services/IRoleValidationService";
import { IFileTypeValidationService } from "../Domain/services/IFileTypeValidationService";
import { UserRole } from "../Domain/enums/UserRole";
import { IFileMapper } from "../Utils/converters/IFileMapper";
import * as path from "path";
import { ISIEMService } from "../siem/Domen/services/ISIEMService";
import { generateEvent } from "../siem/Domen/Helpers/generate/GenerateEvent";

const FILE_SIZE_LIMIT_MB = parseInt(process.env.FILE_SIZE_LIMIT_MB || "10");
const FILE_SIZE_LIMIT = FILE_SIZE_LIMIT_MB * 1024 * 1024; // Convert MB to bytes

export class FileController {
    private router: Router;
    private upload: multer.Multer;

    constructor(
        private fileService: IFileService,
        private roleValidationService: IRoleValidationService,
        private fileTypeValidationService: IFileTypeValidationService,
        private fileMapper: IFileMapper,
        private readonly siemService: ISIEMService,
    ) {
        this.router = Router();
        this.upload = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: FILE_SIZE_LIMIT,
            },
        });
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            "/files/upload",
            this.upload.single("file"),
            this.uploadFile
        );
        this.router.get("/files/download/:fileId", this.downloadFile);
        this.router.delete("/files/:fileId", this.deleteFile);
        this.router.get("/files/author/:authorId", this.getFilesByAuthor);
        this.router.get("/files/metadata/:fileId", this.getFileMetadata);
        this.router.get("/health", this.healthCheck);
    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * GET /api/v1/health
     * Health check endpoint
     * @returns {object} JSON response with service status
     */
    healthCheck = async (req: Request, res: Response): Promise<void> => {
        res.status(200).json({ status: "OK", service: "file-microservice" });
    };

    /**
     * POST /api/v1/files/upload
     * Upload a new file to the system
     * @param {File} req.file - The uploaded file (multipart/form-data)
     * @param {number} req.body.authorId - ID of the user uploading the file
     * @returns {UploadedFileDTO} JSON response with success status, file data, and message
     * @see {@link CreateFileDTO} for input structure
     */
    uploadFile = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: "No file uploaded" });
                return;
            }

            const { authorId } = req.body;
            const userRole = req.headers["x-user-role"] as string;

            if (!authorId) {
                res.status(400).json({ message: "Author ID is required" });
                return;
            }

            if (!userRole) {
                res.status(400).json({ message: "User role is required" });
                return;
            }

            if (!this.roleValidationService.isValidRole(userRole)) {
                res.status(400).json({ message: "Invalid user role" });
                return;
            }

            const role = userRole as UserRole;
            const allowedExtensions =
                this.roleValidationService.getAllowedExtensions(role);
            const allowedExtensionsStrings = allowedExtensions.map((ext) =>
                ext.toString()
            );

            const isValidFileType =
                await this.fileTypeValidationService.validateFileType(
                    req.file.buffer,
                    allowedExtensionsStrings
                );

            if (!isValidFileType) {
                res.status(400).json({
                    message: `File type not allowed for ${role}. Allowed extensions: ${allowedExtensionsStrings.join(
                        ", "
                    )}`,
                });
                return;
            }

            const detectedExtension =
                await this.fileTypeValidationService.getFileExtension(
                    req.file.buffer
                );
            const fileExtension =
                detectedExtension || path.extname(req.file.originalname);
            const fileType = req.file.mimetype;

            const createFileDTO = this.fileMapper.toCreateFileDTO(
                req.file.originalname,
                fileType,
                fileExtension,
                parseInt(authorId),
                req.file.buffer
            );

            const result = await this.fileService.createFile(createFileDTO);

            if (result.success) {
                this.siemService.sendEvent( generateEvent("file-microservice",req,
                    201,"Successfully uploaded file")
                );
                res.status(201).json( result.data );
            } else {
                res.status(500).json({ message: result.error });
            }
        } catch (error) {
            this.siemService.sendEvent( generateEvent("file-microservice",req,
                500,(error as Error).message)
            );
            res.status(500).json({
                message: `Upload failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            });
        }
    };

    /**
     * GET /api/v1/files/:fileId/download
     * Download a file by its ID
     * @param {number} req.params.fileId - ID of the file to download
     * @returns {Buffer} File content with appropriate headers for download
     * @see {@link FileResponseDTO} for response structure
     */
    downloadFile = async (req: Request, res: Response): Promise<void> => {
        try {
            const fileId = parseInt(req.params.fileId);

            if (isNaN(fileId)) {
                res.status(400).json({ message: "Invalid file ID" });
                return;
            }

            const result = await this.fileService.retrieveFile(fileId);

            if (result.success && result.data) {
                this.siemService.sendEvent( generateEvent("file-microservice",req,
                    200,"Successfully dowloaded file")
                );
                res.setHeader("Content-Type", result.data.fileType);
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="${result.data.originalFileName}"`
                );
                res.send(result.data.fileBuffer);
            } else {
                res.status(404).json({
                    message: result.error || "File not found",
                });
            }
        } catch (error) {
            this.siemService.sendEvent( generateEvent("file-microservice",req,
                500,(error as Error).message)
            );
            res.status(500).json({
                message: `Download failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            });
        }
    };

    /**
     * DELETE /api/v1/files/:fileId
     * Delete a file from the system
     * @param {number} req.params.fileId - ID of the file to delete
     * @returns {boolean} JSON response with success status and message
     */
    deleteFile = async (req: Request, res: Response): Promise<void> => {
        try {
            const fileId = parseInt(req.params.fileId);

            if (isNaN(fileId)) {
                res.status(400).json({ message: "Invalid file ID" });
                return;
            }

            const result = await this.fileService.deleteFile(fileId);

            if (result.success) {
                this.siemService.sendEvent( generateEvent("file-microservice",req,
                    200,"Successfully deleted file")
                );
                res.status(200).json(result.data);
            } else {
                this.siemService.sendEvent( generateEvent("file-microservice",req,
                    500,"Delete file failed")
                );
                res.status(500).json({ message: result.error });
            }
        } catch (error) {
            this.siemService.sendEvent( generateEvent("file-microservice",req,
                500,(error as Error).message)
            );
            res.status(500).json({
                message: `Delete failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            });
        }
    };

    /**
     * GET /api/v1/files/author/:authorId
     * Get all files uploaded by a specific author with optional pagination
     * @param {number} req.params.authorId - ID of the author whose files to retrieve
     * @param {number} req.query.offset - Optional offset for pagination (default: 0)
     * @param {number} req.query.limit - Optional limit for pagination (default: no limit)
     * @returns {UploadedFileDTO[]} JSON response with success status and array of file metadata
     * @see {@link UploadedFileDTO} for response structure
     */
    getFilesByAuthor = async (req: Request, res: Response): Promise<void> => {
        try {
            const authorId = parseInt(req.params.authorId);

            if (isNaN(authorId)) {
                res.status(400).json({ message: "Invalid author ID" });
                return;
            }

            // Parse pagination parameters from query string
            let offset: number | undefined = undefined;
            let limit: number | undefined = undefined;

            if (req.query.offset !== undefined) {
                const parsedOffset = parseInt(req.query.offset as string);
                if (isNaN(parsedOffset) || parsedOffset < 0) {
                    res.status(400).json({ message: "Invalid offset parameter. Must be a non-negative integer." });
                    return;
                }
                offset = parsedOffset;
            }

            if (req.query.limit !== undefined) {
                const parsedLimit = parseInt(req.query.limit as string);
                if (isNaN(parsedLimit) || parsedLimit <= 0) {
                    res.status(400).json({ message: "Invalid limit parameter. Must be a positive integer." });
                    return;
                }
                limit = parsedLimit;
            }

            const result = await this.fileService.getFilesByAuthor(authorId, offset, limit);

            if (result.success) {
                res.status(200).json(result.data );
            } else {
                this.siemService.sendEvent( generateEvent("file-microservice",req,
                    500,"Get file by aythor was not successfull")
                );
                res.status(500).json({ message: result.error });
            }
        } catch (error) {
            this.siemService.sendEvent( generateEvent("file-microservice",req,
                500,(error as Error).message)
            );
            res.status(500).json({
                message: `Failed to get files: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            });
        }
    };

    /**
     * GET /api/v1/files/:fileId/metadata
     * Get metadata information for a specific file
     * @param {number} req.params.fileId - ID of the file to get metadata for
     * @returns {UploadedFileDTO} JSON response with success status and file metadata (without file buffer)
     * @see {@link UploadedFileDTO} for response structure
     */
    getFileMetadata = async (req: Request, res: Response): Promise<void> => {
        try {
            const fileId = parseInt(req.params.fileId);

            if (isNaN(fileId)) {
                res.status(400).json({ message: "Invalid file ID" });
                return;
            }

            const result = await this.fileService.retrieveFile(fileId);

            if (result.success && result.data) {
                const metadata = this.fileMapper.toMetadata(result.data);
                res.status(200).json( metadata);
            } else {
                res.status(404).json({
                    message: result.error || "File not found",
                });
            }
        } catch (error) {
            this.siemService.sendEvent( generateEvent("file-microservice",req,
                500,(error as Error).message)
            );
            res.status(500).json({
                message: `Failed to get metadata: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            });
        }
    };
}
