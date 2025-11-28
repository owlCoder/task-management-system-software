export interface CreateFileDTO {
  originalFileName: string;
  fileType: string;
  fileExtension: string;
  authorId: number;
  fileBuffer: Buffer;
}