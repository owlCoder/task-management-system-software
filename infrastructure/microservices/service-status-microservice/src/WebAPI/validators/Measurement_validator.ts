import { CreateMeasurementDto } from "../../Domain/DTOs/CreateMeasurement_DTO";
import { EOperationalStatus } from "../../Domain/enums/EOperationalStatus";

export function validateMeasurementDto(dto: CreateMeasurementDto): string | null {
  if (typeof dto.microserviceId !== "number" || dto.microserviceId <= 0) {
    return "microserviceId must be a positive number";
  }

  if (!Object.values(EOperationalStatus).includes(dto.status)) {
    return "status is invalid";
  }

  if (typeof dto.responseTime !== "number" || dto.responseTime < 0) {
    return "responseTime must be a non-negative number";
  }

  return null; 
}