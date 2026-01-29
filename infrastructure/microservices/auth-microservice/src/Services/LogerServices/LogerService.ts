import { LoggingServiceEnum } from "../../Domain/enums/LoggingServiceEnum";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum, SeverityColors } from "../../Domain/enums/SeverityEnum";

/**
 * Logger service for structured logging with configurable levels.
 * Uses {@link SeverityEnum} for log levels and {@link LoggingServiceEnum} for service identification.
 */
export class LogerService implements ILogerService {
    private readonly service: LoggingServiceEnum;
    private static logLevel: SeverityEnum = SeverityEnum.INFO; // Default to INFO

    constructor(service: LoggingServiceEnum) {
        this.service = service;
    }

    async log(severity: SeverityEnum, message: string): Promise<boolean> {
        if (severity < LogerService.logLevel) {
            return false; // Don't log if below the current log level
        }

        const timestamp = new Date().toISOString();
        const level = SeverityEnum[severity].padEnd(5); // Pad to align levels
        const service = this.service.padEnd(17); // Pad service names for alignment

        console.log(`${timestamp} ${SeverityColors[severity]}${level}\x1b[0m ${service}${message}`);
        return true;
    }

    async err(
    service: string,
    code: string,
    url: string,
    method: string,
    msg: string,
    ): Promise<void> {
        console.log(`\x1b[35m[Logger@1.45.4]\x1b[0m ${msg}`);
    }

    // Static method to set the global log level
    static setLogLevel(level: SeverityEnum): void {
        LogerService.logLevel = level;
    }

    // Static method to get the current log level
    static getLogLevel(): SeverityEnum {
        return LogerService.logLevel;
    }
}