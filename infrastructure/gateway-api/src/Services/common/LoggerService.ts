import { Logger } from "pino";
import { ILoggerService } from "../../Domain/services/common/ILoggerService";

export class LoggerService implements ILoggerService {
    constructor(private readonly logger: Logger) {}
    
    info(service: string, code: string, url: string, method: string, msg: string): void {
        this.log('info', service, code, url, method, msg);
    }

    warn(service: string, code: string, url: string, method: string, msg: string): void {
        this.log('warn', service, code, url, method, msg);
    }

    err(service: string, code: string, url: string, method: string, msg: string): void {
        this.log('error', service, code, url, method, msg);
    }

    private log(level: 'info' | 'warn' | 'error', service: string, code: string, url: string, method: string, msg: string): void {
        this.logger[level]({
            service: service || 'Unknown Service',
            code: code || 'UNKNOWN',
            url: url || 'Unknown URL',
            method: method || 'UNKNOWN'
        }, msg || "No message provided");
    }
}