import { Request } from "express";
import { SIEMEvent } from "../../configs/events/SIEMEvent";

/**
 * Generates a siem event
 * 
 * Extracts method, url, ip, userId, userRole from the request
 * @param {string} service - service that captured event (self) 
 * @param {Request} req - request object from the client 
 * @param {number} statusCode - response status code for the client
 * @param {string} message - brief description of the event
 * @param {string} code - gateway middleware error code
 * @returns siem event
 */
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