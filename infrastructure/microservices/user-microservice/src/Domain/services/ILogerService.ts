export interface ILogerService {
    log(message: string): Promise<boolean>;
    err(service: string, code: string, url: string, method: string, msg: string): void;
}
