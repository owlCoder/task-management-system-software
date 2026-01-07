export interface IFileTypeValidationService {
  validateFileType(fileBuffer: Buffer, allowedExtensions: string[]): Promise<boolean>;
  getFileExtension(fileBuffer: Buffer): Promise<string | null>;
}