import { SeverityEnum } from "../enums/SeverityEnum";

export interface ILogerService {
    log(severity: SeverityEnum, message: string): Promise<boolean>;
}