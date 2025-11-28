import { IFileService } from '../Domain/services/IFileService';
import { IFileRepository } from '../Domain/services/IFileRepository';
import { IFileStorageService } from '../Domain/services/IFileStorageService';
import { CreateFileDTO } from '../Domain/DTOs/CreateFileDTO';
import { UploadedFileDTO } from '../Domain/DTOs/UploadedFileDTO';
import { FileResponseDTO } from '../Domain/DTOs/FileResponseDTO';
import { Result } from '../Domain/types/Result';
import { UploadedFile } from '../Domain/models/UploadedFile';
import { v4 as uuidv4 } from 'uuid';

export class FileService implements IFileService {
  constructor(
    private fileRepository: IFileRepository,
    private fileStorageService: IFileStorageService
  ) {}

  async createFile(fileData: CreateFileDTO): Promise<Result<UploadedFileDTO>> {
    try {
      const fileExtension = fileData.fileExtension.startsWith('.') 
        ? fileData.fileExtension 
        : `.${fileData.fileExtension}`;
      
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const userUuid = uuidv4(); 

      const saveResult = await this.fileStorageService.saveFile(
        userUuid, 
        uniqueFileName, 
        fileData.fileBuffer
      );

      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      const fileModel: UploadedFile = {
        originalFileName: fileData.originalFileName,
        fileType: fileData.fileType,
        fileExtension: fileExtension,
        authorId: fileData.authorId,
        pathToFile: saveResult.data!
      };

      const createResult = await this.fileRepository.create(fileModel);

      if (!createResult.success) {
        await this.fileStorageService.deleteFile(saveResult.data!);
        return { success: false, error: createResult.error };
      }

      const uploadedFileDTO: UploadedFileDTO = {
        fileId: createResult.data!.fileId!,
        originalFileName: createResult.data!.originalFileName,
        fileType: createResult.data!.fileType,
        fileExtension: createResult.data!.fileExtension,
        authorId: createResult.data!.authorId,
        pathToFile: createResult.data!.pathToFile
      };

      return { success: true, data: uploadedFileDTO };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async retrieveFile(fileId: number): Promise<Result<FileResponseDTO>> {
    try {
      const fileResult = await this.fileRepository.getById(fileId);

      if (!fileResult.success) {
        return { success: false, error: fileResult.error };
      }

      if (!fileResult.data) {
        return { success: false, error: 'File not found' };
      }

      const storageResult = await this.fileStorageService.retrieveFile(fileResult.data.pathToFile);

      if (!storageResult.success) {
        return { success: false, error: storageResult.error };
      }

      const fileResponseDTO: FileResponseDTO = {
        fileId: fileResult.data.fileId!,
        originalFileName: fileResult.data.originalFileName,
        fileType: fileResult.data.fileType,
        fileExtension: fileResult.data.fileExtension,
        authorId: fileResult.data.authorId,
        fileBuffer: storageResult.data!
      };

      return { success: true, data: fileResponseDTO };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to retrieve file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async deleteFile(fileId: number): Promise<Result<boolean>> {
    try {
      const fileResult = await this.fileRepository.getById(fileId);

      if (!fileResult.success) {
        return { success: false, error: fileResult.error };
      }

      if (!fileResult.data) {
        return { success: false, error: 'File not found' };
      }

      const storageResult = await this.fileStorageService.deleteFile(fileResult.data.pathToFile);
      
      if (!storageResult.success) {
        return { success: false, error: storageResult.error };
      }

      const deleteResult = await this.fileRepository.delete(fileId);
      
      return deleteResult;
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async getFilesByAuthor(authorId: number): Promise<Result<UploadedFileDTO[]>> {
    try {
      const filesResult = await this.fileRepository.getByAuthorId(authorId);

      if (!filesResult.success) {
        return { success: false, error: filesResult.error };
      }

      const uploadedFileDTOs: UploadedFileDTO[] = filesResult.data!.map(file => ({
        fileId: file.fileId!,
        originalFileName: file.originalFileName,
        fileType: file.fileType,
        fileExtension: file.fileExtension,
        authorId: file.authorId,
        pathToFile: file.pathToFile
      }));

      return { success: true, data: uploadedFileDTOs };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to get files by author: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}