import { ERROR_CODE } from "../../../../Constants/error/ErrorCodes";
import { SIEMLogLevel } from "../../configs/routes/SIEMLogLevel";
import { findRouteConfig } from "../routes/FindRoute";

export function isSIEMEvent(path: string, method: string, statusCode: number, code?: string): boolean {
    if (code && Object.values(ERROR_CODE).includes(code as typeof ERROR_CODE[keyof typeof ERROR_CODE])) {
        return true;
    }

    if (statusCode >= 500) {
        return true;
    }

    const config = findRouteConfig(path, method);

    switch (config.level) {
        case SIEMLogLevel.ERROR:
            return statusCode >= 400;

        case SIEMLogLevel.CRITICAL:
            return true;

        default:
            return false;
    }
}