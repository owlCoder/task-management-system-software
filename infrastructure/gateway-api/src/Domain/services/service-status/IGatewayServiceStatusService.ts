import { MeasurementDto } from "../../DTOs/service-status/measurementDTO";
import { ServiceStatusDto } from "../../DTOs/service-status/serviceStatusDTO";
import { Result } from "../../types/common/Result";


export interface IGatewayServiceStatusService{
    getAllMeasurements(): Promise<Result<MeasurementDto[]>>;
    getAllDownMeasurements(): Promise<Result<MeasurementDto[]>>;
    getServiceStauts(): Promise<Result<ServiceStatusDto[]>>;
}