import { CreateFileDTO } from "../DTOs/CreateFileDTO";
import { DownloadFileDTO } from "../DTOs/DownloadFileDTO";
import { UploadedFileDTO } from "../DTOs/UploadedFileDTO";
import { Result } from "../types/Result";

export interface IGatewayFileService {
    downloadFile(fileId: number): Promise<Result<DownloadFileDTO>>;
    getFilesByAuthorId(authorId: number): Promise<Result<UploadedFileDTO[]>>;
    getFileMetadata(fileId: number): Promise<Result<UploadedFileDTO>>;
    uploadFile(fileData: CreateFileDTO): Promise<Result<UploadedFileDTO>>;
    deleteFile(fileId: number): Promise<Result<boolean>>;
}