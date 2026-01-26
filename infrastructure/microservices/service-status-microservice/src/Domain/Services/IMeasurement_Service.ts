import { CreateMeasurementDto } from "../DTOs/CreateMeasurement_DTO";
import { MeasurementDto } from "../DTOs/Measurement_DTO";
import { EOperationalStatus } from "../enums/EOperationalStatus";

export interface IMeasurement_Service {
  
  getAllMeasurements():Promise<MeasurementDto[]>;
  getMeasurementByID(measurementID: number): Promise<MeasurementDto>;
  getMeasurementsFromMicroservice(microserviceId: number):Promise<MeasurementDto[]>;
  getAllDownMeasurements():Promise<MeasurementDto[]>;
  getNewMeasurements():Promise<MeasurementDto[]>;
  getAverageUptime(): Promise<{ microserviceId: number; uptime: number }[]>
  getAverageResponseTime(days: number): Promise<{ time: string; avgResponseTime: number }[]>
  getServiceStatus(): Promise<{ microserviceName: string; uptime: number; status: EOperationalStatus; }[]>


  setMeasurement(measurement: CreateMeasurementDto): Promise<boolean>

  deleteOldNonDownMeasurements(olderThanMs: number): Promise<number>
  deleteOldMeasurements(status: EOperationalStatus,olderThanMs: number): Promise<number> 
  deleteMeasurement(measurementID: number):Promise<boolean>;
}