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
 * Middleware for handling invalid routes.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} _next - Next function.
 */
export function invalidRouteHandler(req: Request, res: Response, _next: NextFunction): void {
    const message = 'Route not found';

    logger.warn({
        service: SERVICES.SELF,
        code: ERROR_CODE.ROUTING,
        method: req.method,
        url: req.url,
        ip: req.ip,
    }, message);

    res.status(404).json({ message: `Failed to ${req.method} ${req.originalUrl} - ${message}` });

    getSIEMService().sendEvent(
        generateEvent(SERVICES.SELF, req, 404, message, ERROR_CODE.ROUTING)
    );
}