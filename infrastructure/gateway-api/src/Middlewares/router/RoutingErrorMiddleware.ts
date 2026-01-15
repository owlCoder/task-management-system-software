// Framework
import { Request, Response, NextFunction } from "express";

// Infrastructure
import { logger } from "../../Infrastructure/logging/Logger";

/**
 * Middleware for handling invalid routes.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} _next - Next function.
 */
export function invalidRouteHandler(req: Request, res: Response, _next: NextFunction): void {
    logger.warn({
        service: "Gateway",
        code: "ROUTE_NOT_FOUND",
        method: req.method,
        url: req.url,
        ip: req.ip,
    }, `Invalid route accessed`);

    res.status(404).json({ message: `Failed to ${req.method} ${req.originalUrl} - Route not found` });
}