import { UploadedFile } from '../../Domain/models/UploadedFile';
import { CreateFileDTO } from '../../Domain/DTOs/CreateFileDTO';
import { UploadedFileDTO } from '../../Domain/DTOs/UploadedFileDTO';
import { FileResponseDTO } from '../../Domain/DTOs/FileResponseDTO';
import { IFileMapper } from './IFileMapper';

export class FileMapper implements IFileMapper {
  // Maps Entity to UploadedFileDTO (for basic file info response)
  toUploadedFileDTO(entity: UploadedFile): UploadedFileDTO {
    return {
      fileId: entity.file_id!,
      originalFileName: entity.original_file_name,
      fileType: entity.file_type,
      fileExtension: entity.file_extension,
      authorId: entity.author_id,
      pathToFile: entity.path_to_file
    };
  }

  // Maps Entity to FileResponseDTO (includes file buffer for download)
  toFileResponseDTO(entity: UploadedFile, fileBuffer: Buffer): FileResponseDTO {
    return {
      fileId: entity.file_id!,
      originalFileName: entity.original_file_name,
      fileType: entity.file_type,
      fileExtension: entity.file_extension,
      authorId: entity.author_id,
      fileBuffer: fileBuffer
    };
  }

  // Maps multiple entities to UploadedFileDTO array
  toUploadedFileDTOArray(entities: UploadedFile[]): UploadedFileDTO[] {
    return entities.map(entity => this.toUploadedFileDTO(entity));
  }

  // Creates metadata object from FileResponseDTO (excludes file buffer)
  toMetadata(fileData: FileResponseDTO): Omit<FileResponseDTO, 'fileBuffer'> {
    return {
      fileId: fileData.fileId,
      originalFileName: fileData.originalFileName,
      fileType: fileData.fileType,
      fileExtension: fileData.fileExtension,
      authorId: fileData.authorId
    };
  }

  // Creates CreateFileDTO from upload request data
  toCreateFileDTO(originalName: string, fileType: string, fileExtension: string, authorId: number, fileBuffer: Buffer): CreateFileDTO {
    return {
      originalFileName: originalName,
      fileType: fileType,
      fileExtension: fileExtension,
      authorId: authorId,
      fileBuffer: fileBuffer
    };
  }
}