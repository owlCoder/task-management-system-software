import { IFileStorageService } from "../Domain/services/IFileStorageService";
import { Result } from "../Domain/types/Result";
import { determineFileType } from "../helpers/FileTypeHelper";
import * as fs from "fs";
import * as path from "path";

export class FileStorageService implements IFileStorageService {
  private readonly baseDataPath = path.join(__dirname, "../../Data");

  constructor() {
    this.ensureDataDirectoryExists();
  }

  private ensureDataDirectoryExists(): void {
    if (!fs.existsSync(this.baseDataPath)) {
      fs.mkdirSync(this.baseDataPath, { recursive: true });
    }
  }

  private getUserDirectoryPath(userUuid: string): string {
    return path.join(this.baseDataPath, userUuid);
  }

  private ensureUserDirectoryExists(userUuid: string): void {
    const userDir = this.getUserDirectoryPath(userUuid);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
  }

  async saveFile(
    userUuid: number,
    filename: string,
    fileBuffer: Buffer,
    providedFileType?: "image" | "audio" | "video" | "other",
  ): Promise<Result<string>> {
    try {
      const userUuidPath = userUuid.toString();
      this.ensureUserDirectoryExists(userUuidPath);

      const fileType = providedFileType ?? determineFileType(filename);
      let storagePath;

      if (fileType === "image" || fileType === "video") {
        storagePath = path.join(
          this.baseDataPath,
          "media",
          "images_videos",
          userUuidPath,
        );
      } else if (fileType === "audio") {
        storagePath = path.join(
          this.baseDataPath,
          "media",
          "audio",
          userUuidPath,
        );
      } else {
        return { success: false, error: "Unsupported file type" };
      }

      if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, { recursive: true });
      }

      const filePath = path.join(storagePath, filename);
      await fs.promises.writeFile(filePath, fileBuffer);

      return {
        success: true,
        data: path.relative(this.baseDataPath, filePath),
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to save file: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async retrieveFile(filePath: string): Promise<Result<Buffer>> {
    try {
      const fullPath = path.join(this.baseDataPath, filePath);

      if (!fs.existsSync(fullPath)) {
        return { success: false, error: "File not found" };
      }

      const fileBuffer = await fs.promises.readFile(fullPath);

      return { success: true, data: fileBuffer };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve file: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async deleteFile(filePath: string): Promise<Result<boolean>> {
    try {
      const fullPath = path.join(this.baseDataPath, filePath);

      if (!fs.existsSync(fullPath)) {
        return { success: true, data: false };
      }

      await fs.promises.unlink(fullPath);

      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }
}
