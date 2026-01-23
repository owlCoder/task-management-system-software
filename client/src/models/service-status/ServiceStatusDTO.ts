import { EOperationalStatus } from "../../enums/EOperatinalStatus";

export class ServiceStatusDTO {
    constructor(
        public microserviceName: string,
        public uptime: number,
        public status: EOperationalStatus
    ) {}
}