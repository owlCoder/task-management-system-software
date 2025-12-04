export interface ILoggerService {
    info(service: string, code: string, url: string, method: string, msg: string): void;
    warn(service: string, code: string, url: string, method: string, msg: string): void;
    err(service: string, code: string, url: string, method: string, msg: string): void;
}