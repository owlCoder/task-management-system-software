export interface UploadedFileDTO {
    fileId: number;
    originalFileName: string;
    fileType: string;
    fileExtension: string;
    authorId: number;
    pathToFile: string;
}