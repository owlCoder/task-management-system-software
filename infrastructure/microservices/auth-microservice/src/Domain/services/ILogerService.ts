import { SeverityEnum } from "../enums/SeverityEnum";

export interface ILogerService {
    log(severity: SeverityEnum, message: string): Promise<boolean>;
    err(service: string, code: string, url: string, method: string, msg: string): void;
}