import { MeasurementDto } from "../DTOs/Measurement_DTO";

export interface IMicroservice_Service {
  
  getAllMeasurements(): MeasurementDto[];
  getMeasurementByID(measurementID: number): MeasurementDto;
  getMeasurementsFromMicroservice(microserviceId: number): MeasurementDto[];
  getAllCriticalMeasurements(): MeasurementDto[];
  deleteMeasurement(measurementID: number): void;
}