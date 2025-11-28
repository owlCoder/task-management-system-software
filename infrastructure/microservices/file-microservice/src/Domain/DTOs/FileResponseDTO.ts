export interface FileResponseDTO {
  fileId: number;
  originalFileName: string;
  fileType: string;
  fileExtension: string;
  authorId: number;
  fileBuffer: Buffer;
}