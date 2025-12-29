// Framework
import { Response } from "express";

// Domain
import { DownloadFileDTO } from "../../../Domain/DTOs/file/DownloadFileDTO";
import { Result } from "../../../Domain/types/common/Result";

/**
 * Handles the response by sending the result from a microservice to the client.
 * If the result is successful, it returns the data with a success status code. 
 * If the result is unsuccessful, it returns the error message and status code.
 * @param {Response} res - Response for the client.
 * @param {Result<T>} result - The result of the operation from the microservice as {@link Result<T>}.
 * @param {number} [successStatus=200] - Http status code of the successful operation. Defaults to 200.
 * @returns {void}
 */
export function handleResponse<T>(res: Response, result: Result<T>, successStatus: number = 200): void {
    if(result.success){
        res.status(successStatus).json(result.data);
        return;
    }
    res.status(result.status).json({ message: result.message });
}

/**
 * Handles the response by sending the result from a microservice to the client.
 * If the result is successful, it returns no content with a 204 status code. 
 * If the result is unsuccessful, it returns the error message and status code.
 * @param {Response} res - Response for the client.
 * @param {Result<T>} result - The result of the operation from the microservice as {@link Result<T>}.
 * @returns {void}
 */
export function handleEmptyResponse(res: Response, result: Result<void>): void {
    if(result.success){
        res.status(204).send();
        return;
    }
    res.status(result.status).json({ message: result.message });
}

/**
 * Handles the response for downloading a file.
 * If the result is successful, it sends the file with appropriate headers for downloading (Content-Type, Content-Disposition).
 * If the result is unsuccessful, it returns the error message and status code.
 * @param {Response} res - Response for the client.
 * @param {Result<DownloadFileDTO>} result - The result containing the file data or error information.
 * @returns {void} 
 */
export function handleDownloadResponse(res: Response, result: Result<DownloadFileDTO>): void {
    if(result.success){
        res.status(200)
            .setHeader("Content-Type", result.data.contentType)
            .setHeader('Content-Disposition', `attachment; filename="${result.data.fileName}"`)
            .send(result.data.fileBuffer);
        return;
    }
    res.status(result.status).json({ message: result.message });
}