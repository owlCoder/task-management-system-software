import { EOperationalStatus } from "../../enums/service-status/EOperationalStatus";


export class ServiceStatusDto {
  constructor(
    public readonly microserviceName: string,
    public readonly uptime: number,
    public readonly status: EOperationalStatus
  ) {}
}