export interface ILogerService {
    log(message: string): Promise<boolean>;
    error(message: string | unknown): Promise<boolean>;
}