//Framework
import { Request } from "express";

import { UploadedFileDTO } from "../../DTOs/file/UploadedFileDTO";
import { Result } from "../../types/common/Result";
import { StreamResponse } from "../../types/common/StreamResponse";

export interface IGatewayFileService {
    downloadFile(fileId: number): Promise<Result<StreamResponse>>;
    getFilesByAuthorId(authorId: number, offset?: number, limit?: number): Promise<Result<UploadedFileDTO[]>>;
    getFileMetadata(fileId: number): Promise<Result<UploadedFileDTO>>;
    uploadFile(req: Request): Promise<Result<UploadedFileDTO>>;
    deleteFile(fileId: number): Promise<Result<void>>;
}