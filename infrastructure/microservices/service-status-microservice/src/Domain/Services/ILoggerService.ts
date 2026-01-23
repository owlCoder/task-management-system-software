export interface ILoggerService {
    info(code: string, msg: string): void;
    warn(code: string, msg: string): void;
    err(code: string, msg: string): void;
}