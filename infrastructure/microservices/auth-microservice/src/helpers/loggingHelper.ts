import { LogerService } from "../Services/LogerServices/LogerService";
import { SeverityEnum } from "../Domain/enums/SeverityEnum";

/**
 * Sets the global logging level based on environment variables.
 * In development mode or when LOG_LEVEL=DEBUG, sets level to DEBUG.
 * Otherwise, sets level to INFO for production.
 *
 * Development mode is detected by:
 * - NODE_ENV === 'development'
 * - LOG_LEVEL === 'DEBUG'
 *
 * Available log levels: {@link SeverityEnum}
 */
export function setLoggingLevel(): void {
    const isDevelopment =
        process.env.NODE_ENV === 'development' ||
        process.env.LOG_LEVEL === 'DEBUG'

    if (isDevelopment) {
        LogerService.setLogLevel(SeverityEnum.DEBUG);
        console.log('Logging level set to DEBUG for development');
    } else {
        LogerService.setLogLevel(SeverityEnum.INFO);
        console.log('Logging level set to INFO for production');
    }
}