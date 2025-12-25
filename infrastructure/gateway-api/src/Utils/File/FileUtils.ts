// Libraries
import { AxiosResponse } from "axios";

// Domain
import { CreateFileDTO } from "../../Domain/DTOs/file/CreateFileDTO";
import { DownloadFileDTO } from "../../Domain/DTOs/file/DownloadFileDTO";

export function generateFormData(fileData: CreateFileDTO): FormData {
    const formData = new FormData();

    if(fileData.fileBuffer){
        const dataArray = new Uint8Array(fileData.fileBuffer);
        const blob = new Blob([dataArray], {type: fileData.fileType });
        formData.append('file', blob, fileData.originalFileName);
    }
    formData.append('authorId', fileData.authorId.toString());

    return formData;
}

export function extractDownloadDTOFromResponse(response: AxiosResponse): DownloadFileDTO {
    const contentDisposition = response.headers["content-disposition"];
    const contentType = response.headers["content-type"] ?? "application/octet-stream";

    const match = contentDisposition?.match(/filename="(.+?)"/);
    const fileName = match ? match[1] : "download";

    const buffer = Buffer.from(response.data);

    return {
        fileName: fileName,
        contentType: contentType,
        fileBuffer: buffer
    };
}