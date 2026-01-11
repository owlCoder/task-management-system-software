import { EOperationalStatus } from "../enums/EOperationalStatus";

export interface MeasurementDto {
  measurementId: number;
  microserviceId: number;
  status: EOperationalStatus;
  responseTime: number;
  measurementDate: string;
}