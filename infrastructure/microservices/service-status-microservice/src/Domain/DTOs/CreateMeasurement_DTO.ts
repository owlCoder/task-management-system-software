import { EOperationalStatus } from "../enums/EOperationalStatus";


export class CreateMeasurementDto {
  constructor(
    public microserviceId: number,
    public status: EOperationalStatus,
    public responseTime: number
  ) {}
}