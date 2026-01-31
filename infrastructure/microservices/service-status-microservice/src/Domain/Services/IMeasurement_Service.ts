import { CreateMeasurementDto } from "../DTOs/CreateMeasurement_DTO";
import { MeasurementDto } from "../DTOs/Measurement_DTO";
import { EOperationalStatus } from "../enums/EOperationalStatus";

export interface IMeasurement_Service {
  
  getAllMeasurements():Promise<MeasurementDto[]>;
  getMeasurementByID(measurementID: number): Promise<MeasurementDto>;
  getMeasurementsFromMicroservice(microserviceId: number):Promise<MeasurementDto[]>;
  getAllDownMeasurements():Promise<MeasurementDto[]>;
  getLatestStatuses(): Promise<{ microserviceId: number; status: EOperationalStatus }[]> ;getUptime(): Promise<{ microserviceId: number; uptime: number }[]>;
  getAverageResponseTime(days: number): Promise<{ time: string; avgResponseTime: number }[]>;

  setMeasurement(measurement: CreateMeasurementDto): Promise<boolean>

  deleteOldNonDownMeasurements(olderThanMs: number): Promise<number>
  deleteOldMeasurements(status: EOperationalStatus,olderThanMs: number): Promise<number> 
  deleteMeasurement(measurementID: number):Promise<boolean>;
}