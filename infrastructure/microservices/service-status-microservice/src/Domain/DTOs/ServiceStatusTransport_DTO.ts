import { EOperationalStatus } from "../enums/EOperationalStatus";

export class ServiceStatusTransportDto {
    constructor(
        public microserviceName: string,
        public uptime: number,
        public status: EOperationalStatus
    ) { }
}
