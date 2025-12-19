import { IFileService } from '../Domain/services/IFileService';
import { IFileStorageService } from '../Domain/services/IFileStorageService';
import { CreateFileDTO } from '../Domain/DTOs/CreateFileDTO';
import { UploadedFileDTO } from '../Domain/DTOs/UploadedFileDTO';
import { FileResponseDTO } from '../Domain/DTOs/FileResponseDTO';
import { Result } from '../Domain/types/Result';
import { UploadedFile } from '../Domain/models/UploadedFile';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';

export class FileService implements IFileService {
  constructor(
    private fileRepository: Repository<UploadedFile>,
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

      const fileModel = this.fileRepository.create({
        original_file_name: fileData.originalFileName,
        file_type: fileData.fileType,
        file_extension: fileExtension,
        author_id: fileData.authorId,
        path_to_file: saveResult.data!
      });

      const savedFile = await this.fileRepository.save(fileModel);

      const uploadedFileDTO: UploadedFileDTO = {
        fileId: savedFile.file_id!,
        originalFileName: savedFile.original_file_name,
        fileType: savedFile.file_type,
        fileExtension: savedFile.file_extension,
        authorId: savedFile.author_id,
        pathToFile: savedFile.path_to_file
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
      const file = await this.fileRepository.findOne({
        where: { file_id: fileId }
      });

      if (!file) {
        return { success: false, error: 'File not found' };
      }

      const storageResult = await this.fileStorageService.retrieveFile(file.path_to_file);

      if (!storageResult.success) {
        return { success: false, error: storageResult.error };
      }

      const fileResponseDTO: FileResponseDTO = {
        fileId: file.file_id!,
        originalFileName: file.original_file_name,
        fileType: file.file_type,
        fileExtension: file.file_extension,
        authorId: file.author_id,
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
      const file = await this.fileRepository.findOne({
        where: { file_id: fileId }
      });

      if (!file) {
        return { success: false, error: 'File not found' };
      }

      const storageResult = await this.fileStorageService.deleteFile(file.path_to_file);
      
      if (!storageResult.success) {
        return { success: false, error: storageResult.error };
      }

      const deleteResult = await this.fileRepository.delete({ file_id: fileId });
      
      return { success: true, data: (deleteResult.affected ?? 0) > 0 };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async getFilesByAuthor(authorId: number): Promise<Result<UploadedFileDTO[]>> {
    try {
      const files = await this.fileRepository.find({
        where: { author_id: authorId }
      });

      const uploadedFileDTOs: UploadedFileDTO[] = files.map(file => ({
        fileId: file.file_id!,
        originalFileName: file.original_file_name,
        fileType: file.file_type,
        fileExtension: file.file_extension,
        authorId: file.author_id,
        pathToFile: file.path_to_file
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