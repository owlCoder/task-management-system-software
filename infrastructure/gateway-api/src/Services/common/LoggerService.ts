// Libraries
import { Logger } from "pino";

// Domain
import { ILoggerService } from "../../Domain/services/common/ILoggerService";

/**
 * Service used for critical event logging.
 */
export class LoggerService implements ILoggerService {
    constructor(private readonly logger: Logger) {}
    
    /**
     * Informational log.
     * @param {string} service - name of the service.
     * @param {string} code - event code.
     * @param {string} url - targetted url.
     * @param {string} method - called http method.
     * @param {string} msg - event message.
     */
    info(service: string, code: string, url: string, method: string, msg: string): void {
        this.log('info', service, code, url, method, msg);
    }

    /**
     * Warning log.
     * @param {string} service - name of the service.
     * @param {string} code - event code.
     * @param {string} url - targetted url.
     * @param {string} method - called http method.
     * @param {string} msg - event message.
     */
    warn(service: string, code: string, url: string, method: string, msg: string): void {
        this.log('warn', service, code, url, method, msg);
    }

    /**
     * Error log.
     * @param {string} service - name of the service.
     * @param {string} code - event code.
     * @param {string} url - targetted url.
     * @param {string} method - called http method.
     * @param {string} msg - event message.
     */
    err(service: string, code: string, url: string, method: string, msg: string): void {
        this.log('error', service, code, url, method, msg);
    }

    /**
     * Writes informational, warning or error log to console.
     * @param {'info' | 'warn' | 'error'} level - level of the log.
     * @param {string} service - name of the service.
     * @param {string} code - event code.
     * @param {string} url - targetted url.
     * @param {string} method - called http method.
     * @param {string} msg - event message.
     */
    private log(level: 'info' | 'warn' | 'error', service: string, code: string, url: string, method: string, msg: string): void {
        this.logger[level]({
            service: service || 'Unknown Service',
            code: code || 'UNKNOWN',
            url: url || 'Unknown URL',
            method: method || 'UNKNOWN'
        }, msg || "No message provided");
    }
}