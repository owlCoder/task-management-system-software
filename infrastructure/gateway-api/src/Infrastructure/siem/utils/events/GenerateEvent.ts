import { Request } from "express";
import { SIEMEvent } from "../../configs/events/SIEMEvent";

export function generateEvent(service: string, req: Request, statusCode: number, message: string, code?: string): SIEMEvent {
    return {
        service: service,
        method: req.method,
        url: req.url,
        statusCode: statusCode,
        code: code,
        ip: req.ip,
        userId: req.user?.id,
        userRole: req.user?.role,
        message: message
    }
}