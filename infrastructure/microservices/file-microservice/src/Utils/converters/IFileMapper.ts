import { UploadedFile } from '../../Domain/models/UploadedFile';
import { UploadedFileDTO } from '../../Domain/DTOs/UploadedFileDTO';
import { FileResponseDTO } from '../../Domain/DTOs/FileResponseDTO';
import { CreateFileDTO } from '../../Domain/DTOs/CreateFileDTO';

export interface IFileMapper {
  // Maps Entity to UploadedFileDTO (for basic file info response)
  toUploadedFileDTO(entity: UploadedFile): UploadedFileDTO;
  
  // Maps Entity to FileResponseDTO (includes file buffer for download)
  toFileResponseDTO(entity: UploadedFile, fileBuffer: Buffer): FileResponseDTO;
  
  // Maps multiple entities to UploadedFileDTO array
  toUploadedFileDTOArray(entities: UploadedFile[]): UploadedFileDTO[];

  // Creates metadata object from FileResponseDTO (excludes file buffer)
  toMetadata(fileData: FileResponseDTO): Omit<FileResponseDTO, 'fileBuffer'>;

  // Creates CreateFileDTO from upload request data
  toCreateFileDTO(originalName: string, fileType: string, fileExtension: string, authorId: number, fileBuffer: Buffer): CreateFileDTO;
}