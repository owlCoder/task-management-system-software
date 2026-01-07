import { UploadedFile } from '../../Domain/models/UploadedFile';
import { UploadedFileDTO } from '../../Domain/DTOs/UploadedFileDTO';
import { FileResponseDTO } from '../../Domain/DTOs/FileResponseDTO';

export interface IFileMapper {
  // Maps Entity to UploadedFileDTO (for basic file info response)
  toUploadedFileDTO(entity: UploadedFile): UploadedFileDTO;
  
  // Maps Entity to FileResponseDTO (includes file buffer for download)
  toFileResponseDTO(entity: UploadedFile, fileBuffer: Buffer): FileResponseDTO;
  
  // Maps multiple entities to UploadedFileDTO array
  toUploadedFileDTOArray(entities: UploadedFile[]): UploadedFileDTO[];
}