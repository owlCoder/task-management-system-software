import { EOperationalStatus } from "../enums/EOperationalStatus";

export class MeasurementDto {
  constructor(
    public measurementId: number,
    public microserviceId: number,
    public status: EOperationalStatus,
    public responseTime: number,
    public measurementDate: string
  ) {}

}