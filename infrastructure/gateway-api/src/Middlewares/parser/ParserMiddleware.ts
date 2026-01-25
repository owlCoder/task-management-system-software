// Framework
import { Request, Response, NextFunction } from "express";

// Constants
import { SERVICES } from "../../Constants/services/Services";
import { ERROR_CODE } from "../../Constants/error/ErrorCodes";

// Infrastructure
import { logger } from "../../Infrastructure/logging/Logger";
import { getSIEMService } from "../../Infrastructure/siem/service/SIEMServiceInstance";
import { generateEvent } from "../../Infrastructure/siem/utils/events/GenerateEvent";

/**
 * Captures errors caused by express json parser.
 * @param {unknown} err - Error that has occured. 
 * @param {Request} req - The request object. 
 * @param {Response} res - The response object.
 * @param {NextFunction} next - Next middleware. 
 * @returns void
 */
export function bodyParserErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof Error && 'status' in err && typeof err.status === 'number') {
        const status = err.status;
        let message: string | undefined;

        switch (status) {
            case 400:
                message = 'The request body syntax is incorrect';
                break;
            case 413:
                message = 'The data sent exceeds the server limit';
                break;
            case 415:
                message = 'The content encoding is not supported';
                break;
            default:
                message = 'Invalid request';
                break;
        }

        if (message) {
            logger.warn({
                service: SERVICES.SELF,
                code: ERROR_CODE.JSON_PARSER,
                method: req.method,
                url: req.url,
                ip: req.ip
            }, message);

            getSIEMService().sendEvent(
                generateEvent(SERVICES.SELF, req, status, message, ERROR_CODE.JSON_PARSER)
            );
            
            res.status(status).json({ message: message });
            return; 
        }
    }
    next(err);
}