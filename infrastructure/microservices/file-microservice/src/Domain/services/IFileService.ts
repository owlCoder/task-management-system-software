import { CreateFileDTO } from '../DTOs/CreateFileDTO';
import { UploadedFileDTO } from '../DTOs/UploadedFileDTO';
import { FileResponseDTO } from '../DTOs/FileResponseDTO';
import { Result } from '../types/Result';

export interface IFileService {
  createFile(fileData: CreateFileDTO): Promise<Result<UploadedFileDTO>>;
  retrieveFile(fileId: number): Promise<Result<FileResponseDTO>>;
  deleteFile(fileId: number): Promise<Result<boolean>>;
  getFilesByAuthor(authorId: number, offset?: number, limit?: number): Promise<Result<UploadedFileDTO[]>>;
}