import { Request, Response } from 'express';
import { IFileService } from '../Domain/services/IFileService';
import { CreateFileDTO } from '../Domain/DTOs/CreateFileDTO';
import * as path from 'path';

export class FileController {
  constructor(private fileService: IFileService) {}

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