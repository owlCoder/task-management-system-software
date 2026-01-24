// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayServiceStatusService } from "../../Domain/services/service-status/IGatewayServiceStatusService";
import { MeasurementDTO } from "../../Domain/DTOs/service-status/measurementDTO";
import { ServiceStatusDTO } from "../../Domain/DTOs/service-status/serviceStatusDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";
import { SERVICES } from "../../Constants/services/Services";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICE_STATUS_ROUTES } from "../../Constants/routes/service-status/ServiceStatusRoutes";

// Infrastructure
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";

export class GatewayServiceStatusService implements IGatewayServiceStatusService {
    private readonly serviceStatusClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.serviceStatusClient = createAxiosClient(API_ENDPOINTS.SERVICE_STATUS);
    }

    async getAllMeasurements(): Promise<Result<MeasurementDTO[]>> {
        return await makeAPICall<MeasurementDTO[]>(this.serviceStatusClient, this.errorHandlingService, {
            serviceName: SERVICES.SERVICE_STATUS,
            method: HTTP_METHODS.GET,
            url: SERVICE_STATUS_ROUTES.GET_ALL_MEASUREMENTS,
        });
    }
    
    async getAllDownMeasurements(): Promise<Result<MeasurementDTO[]>> {
        return await makeAPICall<MeasurementDTO[]>(this.serviceStatusClient, this.errorHandlingService, {
            serviceName: SERVICES.SERVICE_STATUS,
            method: HTTP_METHODS.GET,
            url: SERVICE_STATUS_ROUTES.GET_ALL_DOWN_MEASUREMENTS,
        });
    }

    async getServiceStauts(): Promise<Result<ServiceStatusDTO[]>> {
        return await makeAPICall<ServiceStatusDTO[]>(this.serviceStatusClient, this.errorHandlingService, {
            serviceName: SERVICES.SERVICE_STATUS,
            method: HTTP_METHODS.GET,
            url: SERVICE_STATUS_ROUTES.GET_SERIVCE_STATUS,
        });
    }

}