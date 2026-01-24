import { AxiosInstance } from "axios";
import { MeasurementDto } from "../../Domain/DTOs/service-status/measurementDTO";
import { ServiceStatusDto } from "../../Domain/DTOs/service-status/serviceStatusDTO";
import { IGatewayServiceStatusService } from "../../Domain/services/service-status/IGatewayServiceStatusService";
import { Result } from "../../Domain/types/common/Result";
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";
import { SERVICES } from "../../Constants/services/Services";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICE_STATUS_ROUTES } from "../../Constants/routes/service-status/ServiceStatusRoutes";

export class GatewayServiceStatusService implements IGatewayServiceStatusService {
    private readonly serviceStatusClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.serviceStatusClient = createAxiosClient(API_ENDPOINTS.SERVICE_STATUS);
    }

    async getAllMeasurements(): Promise<Result<MeasurementDto[]>> {
        return await makeAPICall<MeasurementDto[]>(
            this.serviceStatusClient,
            this.errorHandlingService,
            {
                serviceName: SERVICES.SERVICE_STATUS,
                method: HTTP_METHODS.GET,
                url: SERVICE_STATUS_ROUTES.GET_ALL_MEASUREMENTS,
            }
        );
    }
    
    async getAllDownMeasurements(): Promise<Result<MeasurementDto[]>> {
        return await makeAPICall<MeasurementDto[]>(
            this.serviceStatusClient,
            this.errorHandlingService,
            {
                serviceName: SERVICES.SERVICE_STATUS,
                method: HTTP_METHODS.GET,
                url: SERVICE_STATUS_ROUTES.GET_ALL_DOWN_MEASUREMENTS,
            }
        );
    }

    async getServiceStauts(): Promise<Result<ServiceStatusDto[]>> {
        return await makeAPICall<ServiceStatusDto[]>(
            this.serviceStatusClient,
            this.errorHandlingService,
            {
                serviceName: SERVICES.SERVICE_STATUS,
                method: HTTP_METHODS.GET,
                url: SERVICE_STATUS_ROUTES.GET_SERIVCE_STATUS,
            }
        );
    }
}