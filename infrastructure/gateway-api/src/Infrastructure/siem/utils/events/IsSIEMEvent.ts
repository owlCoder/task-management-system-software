import { ERROR_CODE } from "../../../../Constants/error/ErrorCodes";
import { SIEMLogLevel } from "../../configs/routes/SIEMLogLevel";
import { findRouteConfig } from "../routes/FindRoute";

/**
 * Checks if the captured event is a siem event
 * @param {string} path - path of the request (e.g. /login)
 * @param {string} method - method of the request  (e.g. GET)
 * @param {number} statusCode - status code sent to client 
 * @param {string} code - gateway middleware error code (optional) 
 * @returns 
 */
export function isSIEMEvent(path: string, method: string, statusCode: number, code?: string): boolean {
    // if event is captured by the middleware it's a siem event
    if (code && Object.values(ERROR_CODE).includes(code as typeof ERROR_CODE[keyof typeof ERROR_CODE])) {
        return true;
    }

    // all server errors are siem events
    if (statusCode >= 500) {
        return true;
    }

    // matching called route to its logging level
    const config = findRouteConfig(path, method);

    switch (config.level) {
        case SIEMLogLevel.ERROR:
            return statusCode > 400;

        case SIEMLogLevel.CRITICAL:
            return true;

        default:
            return false;
    }
}