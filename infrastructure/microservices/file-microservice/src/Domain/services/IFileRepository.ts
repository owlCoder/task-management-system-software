import { UploadedFile } from '../models/UploadedFile';
import { Result } from '../types/Result';

export interface IFileRepository {
  create(file: UploadedFile): Promise<Result<UploadedFile>>;
  getById(fileId: number): Promise<Result<UploadedFile | null>>;
  delete(fileId: number): Promise<Result<boolean>>;
  getByAuthorId(authorId: number): Promise<Result<UploadedFile[]>>;
}