// Libraries
import { AxiosResponse } from "axios";

// Domain
import { DownloadFileDTO } from "../../../Domain/DTOs/file/DownloadFileDTO";

/**
 * Extracts the data of the file that is being downloaded from response.
 * @param {AxiosResponse} response - response received from the microservice.
 * @returns {DownloadFileDTO} file metadata and content.
 */
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