import { Logger } from "pino";
import { ILoggerService } from "../Domain/Services/ILoggerService";



export class LoggerService implements ILoggerService {
    constructor(private readonly logger: Logger) {}
    
    info(code: string, msg: string): void {
        this.log('info', code, msg);
    }


    warn(code: string,  msg: string): void {
        this.log('warn',  code, msg);
    }


    err( code: string, msg: string): void {
        this.log('error', code, msg);
    }


    private log(level: 'info' | 'warn' | 'error', code: string, msg: string): void {
        this.logger[level]({
            code: code || 'UNKNOWN',
           }, msg || "No message provided");
    }
}