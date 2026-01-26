import { AverageTimeDTO } from "../../models/service-status/AverageTimeDTO";
import { MeasurementDto } from "../../models/service-status/MeasurementDTO";
import {ServiceStatusDTO} from "../../models/service-status/ServiceStatusDTO"

export interface IServiceStatusAPI {
    getAllDownMeasurements(): Promise<MeasurementDto[]>
    getServiceStatus(): Promise<ServiceStatusDTO[]>;
    getAvgResponseTime(days:number):Promise<AverageTimeDTO[]>
}