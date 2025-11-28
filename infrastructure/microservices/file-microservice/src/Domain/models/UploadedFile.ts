export interface UploadedFile {
  fileId?: number;
  originalFileName: string;
  fileType: string;
  fileExtension: string;
  authorId: number;
  pathToFile: string;
}