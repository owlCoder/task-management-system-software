// Framework
import { Response } from "express";

// Domain
import { Result } from "../../../Domain/types/common/Result";
import { StreamResponse } from "../../../Domain/types/common/StreamResponse";

// Constants
import { SERVICES } from "../../../Constants/services/Services";

// Utils
import { setupStreamCleanup } from "./StreamCleanup";

// Infrastructure
import { getSIEMService } from "../../../Infrastructure/siem/service/SIEMServiceInstance";
import { generateEvent } from "../../../Infrastructure/siem/utils/events/GenerateEvent";

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
        getSIEMService().sendEvent(
            generateEvent(SERVICES.SELF, res.req, successStatus, "Request successful")
        );

        res.status(successStatus).json(result.data);
        return;
    }

    getSIEMService().sendEvent(
        generateEvent(SERVICES.SELF, res.req, result.status, result.message)
    );

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
        getSIEMService().sendEvent(
            generateEvent(SERVICES.SELF, res.req, 204, "Request successful")
        );

        res.status(204).send();
        return;
    }

    getSIEMService().sendEvent(
        generateEvent(SERVICES.SELF, res.req, result.status, result.message)
    );

    res.status(result.status).json({ message: result.message });
}

/**
 * Handles the response for downloading a file.
 * @param {Response} res - Response for the client.
 * @param {Result<StreamResponse>} result - The result data is streamed to the client.
 * @returns {void} 
 * - On success it sends the file with appropriate headers for downloading (Content-Type, Content-Disposition).
 * - On failure it returns the error message and status code.
 */
export function handleDownloadResponse(res: Response, result: Result<StreamResponse>): void {
    if(result.success){
        const { stream, headers } = result.data;
        
        const contentType = headers["content-type"]?.toString() ?? "application/octet-stream";
        const contentDisposition = headers["content-disposition"]?.toString() ?? "attachment; filename=file";

        getSIEMService().sendEvent(
            generateEvent(SERVICES.SELF, res.req, 200, "Download successful")
        );

        res.status(200).setHeader("Content-Type", contentType).setHeader('Content-Disposition', contentDisposition);

        if (headers["content-length"]) {
            res.setHeader("Content-Length", headers["content-length"]);
        }
        
        setupStreamCleanup(stream, res);
        stream.pipe(res);
        return;
    }

    getSIEMService().sendEvent(
        generateEvent(SERVICES.SELF, res.req, result.status, result.message)
    );

    res.status(result.status).json({ message: result.message });
}