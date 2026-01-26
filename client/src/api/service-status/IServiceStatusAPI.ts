import { AverageTimeDTO } from "../../models/service-status/AverageTimeDTO";
import {ServiceStatusDTO} from "../../models/service-status/ServiceStatusDTO"

export interface IServiceStatusAPI {

    getServiceStatus(): Promise<ServiceStatusDTO[]>;
    getAvgResponseTime(days:number):Promise<AverageTimeDTO[]>
}