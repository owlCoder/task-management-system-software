import { EOperationalStatus } from "../../enums/EOperatinalStatus";

export class MeasurementDto {
  constructor(
    public measurementId: number,
    public microserviceName: string,
    public status: EOperationalStatus,
    public responseTime: number,
    public measurementDate: string
  ) {}

}