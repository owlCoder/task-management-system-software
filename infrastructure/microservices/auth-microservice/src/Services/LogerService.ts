import { LoggingServiceEnum } from "../Domain/enums/LoggingServiceEnum";
import { ILogerService } from "../Domain/services/ILogerService";
import { SeverityEnum } from "../Domain/enums/SeverityEnum";

export class LogerService implements ILogerService {
    private readonly service: LoggingServiceEnum;
    constructor(service: LoggingServiceEnum) {
        this.service = service;
    }

    async log(severity: SeverityEnum, message: string): Promise<boolean> {
        console.log(`${severity}[${this.service}@0.1] ${message}\x1b[0m`);
        return true;
    }
}