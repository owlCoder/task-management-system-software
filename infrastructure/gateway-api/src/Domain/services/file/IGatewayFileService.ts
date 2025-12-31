import { CreateFileDTO } from "../../DTOs/file/CreateFileDTO";
import { DownloadFileDTO } from "../../DTOs/file/DownloadFileDTO";
import { UploadedFileDTO } from "../../DTOs/file/UploadedFileDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayFileService {
    downloadFile(fileId: number): Promise<Result<DownloadFileDTO>>;
    getFilesByAuthorId(authorId: number): Promise<Result<UploadedFileDTO[]>>;
    getFileMetadata(fileId: number): Promise<Result<UploadedFileDTO>>;
    uploadFile(data: CreateFileDTO): Promise<Result<UploadedFileDTO>>;
    deleteFile(fileId: number): Promise<Result<void>>;
}