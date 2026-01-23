import {ServiceStatusDTO} from "../../models/service-status/ServiceStatusDTO"

export interface IServiceStatusAPI {

    getServiceStatus(): Promise<ServiceStatusDTO[]>;

}