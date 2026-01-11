import { EOperationalStatus } from "../enums/EOperationalStatus";

export interface CreateMeasurementDto {
  microserviceId: number;
  status: EOperationalStatus;
  responseTime: number;
}