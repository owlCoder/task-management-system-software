import { Result } from "../types/Result";

export interface IFileStorageService {
  saveFile(
    userUuid: number,
    filename: string,
    fileBuffer: Buffer,
    fileType: "image" | "audio" | "video" | null,
  ): Promise<Result<string>>;
  retrieveFile(filePath: string): Promise<Result<Buffer>>;
  deleteFile(filePath: string): Promise<Result<boolean>>;
}
