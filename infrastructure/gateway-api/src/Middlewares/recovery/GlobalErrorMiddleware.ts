// Framework
import { Request, Response, NextFunction } from "express";

// Infrastructure
import { logger } from "../../Infrastructure/logging/Logger";

/**
 * Middleware for handling unexpected errors.
 * @param {unknown} err - Error that has occured.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} _next - Next function.
 * @returns {void}
 */
export function globalErrorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
    const error = err instanceof Error ? err : new Error(String(err));
    const statusCode = err && (typeof err === 'object') && ('status' in err) && (typeof err.status === 'number') ? err.status : 500;

    logger.error({
        service: "Gateway",
        code: "CRITICAL_ERR",
        method: req.method,
        url: req.url,
        ip: req.ip,
    }, `Message: ${error.message} | Status: ${statusCode} | \nStack:\n${error.stack}`);

    const message = statusCode >= 500 
        ? "An unexpected gateway error occurred"
        : error.message || "Bad request";

    res.status(statusCode).json({ message: message });
}