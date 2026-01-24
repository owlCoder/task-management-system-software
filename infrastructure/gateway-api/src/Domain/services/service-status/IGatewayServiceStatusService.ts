import { MeasurementDTO } from "../../DTOs/service-status/measurementDTO";
import { ServiceStatusDTO } from "../../DTOs/service-status/serviceStatusDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayServiceStatusService {
    getAllMeasurements(): Promise<Result<MeasurementDTO[]>>;
    getAllDownMeasurements(): Promise<Result<MeasurementDTO[]>>;
    getServiceStauts(): Promise<Result<ServiceStatusDTO[]>>;
}