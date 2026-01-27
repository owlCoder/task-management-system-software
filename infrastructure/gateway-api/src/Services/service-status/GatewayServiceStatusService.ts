// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayServiceStatusService } from "../../Domain/services/service-status/IGatewayServiceStatusService";
import { MeasurementDTO } from "../../Domain/DTOs/service-status/measurementDTO";
import { ServiceStatusDTO } from "../../Domain/DTOs/service-status/serviceStatusDTO";
import { AverageTimeDTO } from "../../Domain/DTOs/service-status/AverageTimeDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";
import { SERVICES } from "../../Constants/services/Services";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICE_STATUS_ROUTES } from "../../Constants/routes/service-status/ServiceStatusRoutes";

// Infrastructure
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";

/**
 * Makes API requests to the Service-Status Microservice.
 */
export class GatewayServiceStatusService implements IGatewayServiceStatusService {
    private readonly serviceStatusClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.serviceStatusClient = createAxiosClient(API_ENDPOINTS.SERVICE_STATUS);
    }

    /**
     * Fetches all measurements.
     * @returns {Promise<Result<MeasurementDTO[]>>} - A promise that resolves to a Result object containing the data of the measurements.
     * - On success returns data as {@link MeasurementDTO[]}.
     * - On failure returns status code and error message.
     */
    async getAllMeasurements(): Promise<Result<MeasurementDTO[]>> {
        return await makeAPICall<MeasurementDTO[]>(this.serviceStatusClient, this.errorHandlingService, {
            serviceName: SERVICES.SERVICE_STATUS,
            method: HTTP_METHODS.GET,
            url: SERVICE_STATUS_ROUTES.GET_ALL_MEASUREMENTS,
        });
    }
    
    /**
     * Fetches all down measurements.
     * @returns {Promise<Result<MeasurementDTO[]>>} - A promise that resolves to a Result object containing the data of the down measurements.
     * - On success returns data as {@link MeasurementDTO[]}.
     * - On failure returns status code and error message.
     */
    async getAllDownMeasurements(): Promise<Result<MeasurementDTO[]>> {
        return await makeAPICall<MeasurementDTO[]>(this.serviceStatusClient, this.errorHandlingService, {
            serviceName: SERVICES.SERVICE_STATUS,
            method: HTTP_METHODS.GET,
            url: SERVICE_STATUS_ROUTES.GET_ALL_DOWN_MEASUREMENTS,
        });
    }

    /**
     * Fetches the statuses of all services.
     * @returns {Promise<Result<ServiceStatusDTO[]>>} - A promise that resolves to a Result object containing the data of the statuses.
     * - On success returns data as {@link ServiceStatusDTO[]}.
     * - On failure returns status code and error message.
     */
    async getServiceStauts(): Promise<Result<ServiceStatusDTO[]>> {
        return await makeAPICall<ServiceStatusDTO[]>(this.serviceStatusClient, this.errorHandlingService, {
            serviceName: SERVICES.SERVICE_STATUS,
            method: HTTP_METHODS.GET,
            url: SERVICE_STATUS_ROUTES.GET_SERIVCE_STATUS,
        });
    }

    /**
     * Fetches the average response time for all services.
     * @returns {Promise<Result<ProjectDTO[]>>} - A promise that resolves to a Result object containing the data of the statuses.
     * - On success returns data as {@link ServiceStatusDTO[]}.
     * - On failure returns status code and error message.
     */
    async getAvgResponseTime(days: number):Promise<Result<AverageTimeDTO[]>>{
        return await makeAPICall<AverageTimeDTO[]>(this.serviceStatusClient, this.errorHandlingService, {
            serviceName: SERVICES.SERVICE_STATUS,
            method: HTTP_METHODS.GET,
            url: SERVICE_STATUS_ROUTES.GET_AVG_RESPONSE_TIME(days),
        });
    }

}