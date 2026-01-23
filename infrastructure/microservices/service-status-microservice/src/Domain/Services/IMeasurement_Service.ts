import { MeasurementDto } from "../DTOs/Measurement_DTO";

export interface IMeasurement_Service {
  
  getAllMeasurements():Promise<MeasurementDto[]>;
  getMeasurementByID(measurementID: number): Promise<MeasurementDto>;
  getMeasurementsFromMicroservice(microserviceId: number):Promise<MeasurementDto[]>;
  getAllDownMeasurements():Promise<MeasurementDto[]>;
  getNewMeasurements():Promise<MeasurementDto[]>;
  getAverageUptime(): Promise<{ microserviceId: number; uptime: number }[]>

  setMeasurement(measurement: MeasurementDto):Promise<boolean>;

  deleteMeasurement(measurementID: number):Promise<boolean>;
}