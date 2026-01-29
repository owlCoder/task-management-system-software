import { UploadedFileDTO } from '../../external-dtos/UploadedFileDTO';
import { Result } from '../../types/Result';

export interface IFileServiceClient {
    getFileMetaData(file_id: number): Promise<Result<UploadedFileDTO>>;
}