import { Result } from '../types/Result';

export interface IFileStorageService {
  saveFile(userUuid: number, filename: string, fileBuffer: Buffer): Promise<Result<string>>;
  retrieveFile(filePath: string): Promise<Result<Buffer>>;
  deleteFile(filePath: string): Promise<Result<boolean>>;
}