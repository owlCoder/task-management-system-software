// Framework
import { Request, Response, NextFunction } from "express";

// Infrastructure
import { logger } from "../../Infrastructure/logging/Logger";

/**
 * Middleware to log incoming and outgoing HTTP traffic.
 * Logs the details of each request and its corresponding response, including the method, URL, status code, and the client’s IP address. 
 * The logs are categorized by the status code range into different log levels:
 * - `info` for successful requests (2xx and 3xx status codes).
 * - `warn` for client errors (4xx status codes).
 * - `error` for server errors (5xx status codes).
 * @param {Request} req - The request object, representing the incoming HTTP request.
 * @param {Response} res - The response object, representing the outgoing HTTP response.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 */
export function logTraffic(req: Request, res: Response, next: NextFunction) {
    logger.info({
        service: "Gateway",
        method: req.method,
        url: req.url,
        code: "REQUEST",
        ip: req.ip
    }, "Incoming request");

    res.on('finish', () => {
        let logLevel: `info` | `warn` | `error` = "info";
        if(res.statusCode >= 400 && res.statusCode < 500){
            logLevel = "warn";
        }
        else if(res.statusCode >= 500 && res.statusCode < 600){
            logLevel = "error";
        }

        logger[logLevel]({
            service: "Gateway",
            method: req.method,
            url: req.originalUrl,
            code: "RESPONSE",
            ip: req.ip
        }, `Outgoing response status: ${res.statusCode}`);
    });

    next();
}