import { Request, Response, Router } from 'express';
import multer from 'multer';
import { IFileService } from '../Domain/services/IFileService';
import { CreateFileDTO } from '../Domain/DTOs/CreateFileDTO';
import * as path from 'path';

export class FileController {
  private router: Router;
  private upload: multer.Multer;

  constructor(private fileService: IFileService) {
    this.router = Router();
    this.upload = multer({ 
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024
      }
    });
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/files/upload', this.upload.single('file'), this.uploadFile);
    this.router.get('/files/download/:fileId', this.downloadFile);
    this.router.delete('/files/:fileId', this.deleteFile);
    this.router.get('/files/author/:authorId', this.getFilesByAuthor);
    this.router.get('/files/metadata/:fileId', this.getFileMetadata);
    this.router.get('/health', this.healthCheck);
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
    res.status(200).json({ status: 'OK', service: 'file-microservice' });
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
        res.status(400).json({ success: false, error: 'No file uploaded' });
        return;
      }

      const { authorId } = req.body;

      if (!authorId) {
        res.status(400).json({ success: false, error: 'Author ID is required' });
        return;
      }

      const fileExtension = path.extname(req.file.originalname);
      const fileType = req.file.mimetype;

      const createFileDTO: CreateFileDTO = {
        originalFileName: req.file.originalname,
        fileType: fileType,
        fileExtension: fileExtension,
        authorId: parseInt(authorId),
        fileBuffer: req.file.buffer
      };

      const result = await this.fileService.createFile(createFileDTO);

      if (result.success) {
        res.status(201).json({ success: true, data: result.data });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
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
        res.status(400).json({ success: false, error: 'Invalid file ID' });
        return;
      }

      const result = await this.fileService.retrieveFile(fileId);

      if (result.success && result.data) {
        res.setHeader('Content-Type', result.data.fileType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.data.originalFileName}"`);
        res.send(result.data.fileBuffer);
      } else {
        res.status(404).json({ success: false, error: result.error || 'File not found' });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
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
        res.status(400).json({ success: false, error: 'Invalid file ID' });
        return;
      }

      const result = await this.fileService.deleteFile(fileId);

      if (result.success) {
        res.status(200).json({ success: true, data: result.data });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: `Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  };

  /**
   * GET /api/v1/files/author/:authorId
   * Get all files uploaded by a specific author
   * @param {number} req.params.authorId - ID of the author whose files to retrieve
   * @returns {UploadedFileDTO[]} JSON response with success status and array of file metadata
   * @see {@link UploadedFileDTO} for response structure
   */
  getFilesByAuthor = async (req: Request, res: Response): Promise<void> => {
    try {
      const authorId = parseInt(req.params.authorId);

      if (isNaN(authorId)) {
        res.status(400).json({ success: false, error: 'Invalid author ID' });
        return;
      }

      const result = await this.fileService.getFilesByAuthor(authorId);

      if (result.success) {
        res.status(200).json({ success: true, data: result.data });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: `Failed to get files: ${error instanceof Error ? error.message : 'Unknown error'}` 
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
        res.status(400).json({ success: false, error: 'Invalid file ID' });
        return;
      }

      const result = await this.fileService.retrieveFile(fileId);

      if (result.success && result.data) {
        const metadata = {
          fileId: result.data.fileId,
          originalFileName: result.data.originalFileName,
          fileType: result.data.fileType,
          fileExtension: result.data.fileExtension,
          authorId: result.data.authorId
        };
        res.status(200).json({ success: true, data: metadata });
      } else {
        res.status(404).json({ success: false, error: result.error || 'File not found' });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: `Failed to get metadata: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  };
}