import { Request, Response, NextFunction } from "express";
import { logger } from "../../Utils/Logger/Logger";

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