import { IFileTypeValidationService } from '../Domain/services/IFileTypeValidationService';
import FileType from 'file-type';

export class FileTypeValidationService implements IFileTypeValidationService {

  async validateFileType(fileBuffer: Buffer, allowedExtensions: string[]): Promise<boolean> {
    try {
      const fileType = await FileType.fromBuffer(fileBuffer);
      
      if (!fileType) {
        return false;
      }

      const detectedExtension = `.${fileType.ext}`;
      return allowedExtensions.includes(detectedExtension);
    } catch (error) {
      return false;
    }
  }

  async getFileExtension(fileBuffer: Buffer): Promise<string | null> {
    try {
      const fileType = await FileType.fromBuffer(fileBuffer);
      return fileType ? `.${fileType.ext}` : null;
    } catch (error) {
      return null;
    }
  }
}