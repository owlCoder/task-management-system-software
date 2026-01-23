// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayAnalyticsService } from "../../Domain/services/analytics/IGatewayAnalyticsService";
import { BurndownDTO } from "../../Domain/DTOs/analytics/BurndownDTO";
import { BurnupDTO } from "../../Domain/DTOs/analytics/BurnupDTO";
import { BudgetTrackingDTO } from "../../Domain/DTOs/analytics/BudgetTrackingDTO";
import { ResourceCostAllocationDTO } from "../../Domain/DTOs/analytics/ResourceCostAllocationDTO";
import { ProfitMarginDTO } from "../../Domain/DTOs/analytics/ProfitMarginDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { SERVICES } from "../../Constants/services/Services";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { ANALYTICS_ROUTES } from "../../Constants/routes/analytics/AnalyticsRoutes";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";
import { TimeSeriesPointDto } from "../../Domain/DTOs/analytics/TimeSeriesPointDTO";

/**
 * Makes API requests to the Analytics Microservice.
 */
export class GatewayAnalyticsService implements IGatewayAnalyticsService {
    private readonly analyticsClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.analyticsClient = createAxiosClient(API_ENDPOINTS.ANALYTICS);
    }

    /**
     * Fetches the burndown analytics for a specific sprint.
     * @param {number} sprintId - id of the sprint.
     * @returns {Promise<Result<BurndownDTO>>} - A promise that resolves to a Result object containing the burndown data.
     * - On success returns data as {@link BurndownDTO}.
     * - On failure returns status code and error message.
     */
    async getBurndownAnalyticsBySprintId(sprintId: number): Promise<Result<BurndownDTO>> {
        return await makeAPICall<BurndownDTO>(this.analyticsClient, this.errorHandlingService, {
            serviceName: SERVICES.ANALYTICS,
            method: HTTP_METHODS.GET,
            url: ANALYTICS_ROUTES.BURNDOWN_BY_SPRINT(sprintId)
        });
    }

    /**
     * Fetches the burnup analytics for a specific sprint.
     * @param {number} sprintId - id of the sprint.
     * @returns {Promise<Result<BurnupDTO>>} - A promise that resolves to a Result object containing the burnup data.
     * - On success returns data as {@link BurnupDTO}.
     * - On failure returns status code and error message.
     */
    async getBurnupAnalyticsBySprintId(sprintId: number): Promise<Result<BurnupDTO>> {
        return await makeAPICall<BurnupDTO>(this.analyticsClient, this.errorHandlingService, {
            serviceName: SERVICES.ANALYTICS,
            method: HTTP_METHODS.GET,
            url: ANALYTICS_ROUTES.BURNUP_BY_SPRINT(sprintId)
        });
    }

    /**
     * Fetches the velocity analytics for a specific project.
     * @param {number} projectId - id of the project.
     * @returns {Promise<Result<number>>} - A promise that resolves to a Result object containing the velocity data.
     * - On success returns data as number that represents velocity.
     * - On failure returns status code and error message.
     */
    async getVelocityAnalyticsByProjectId(projectId: number): Promise<Result<number>> {
        return await makeAPICall<number>(this.analyticsClient, this.errorHandlingService, {
            serviceName: SERVICES.ANALYTICS,
            method: HTTP_METHODS.GET,
            url: ANALYTICS_ROUTES.VELOCITY_BY_PROJECT(projectId)
        });
    }

    /**
     * Fetches the budget analytics for a specific project.
     * @param {number} projectId - id of the project.
     * @returns {Promise<Result<BudgetTrackingDTO>>} - A promise that resolves to a Result object containing the budget data.
     * - On success returns data as {@link BudgetTrackingDTO}.
     * - On failure returns status code and error message.
     */
    async getBudgetTrackingByProjectId(projectId: number): Promise<Result<BudgetTrackingDTO>> {
        return await makeAPICall<BudgetTrackingDTO>(this.analyticsClient, this.errorHandlingService, {
            serviceName: SERVICES.ANALYTICS,
            method: HTTP_METHODS.GET,
            url: ANALYTICS_ROUTES.BUDGET_BY_PROJECT(projectId)
        });
    }

    /**
     * Fetches the resource cost analytics for a specific project.
     * @param {number} projectId - id of the project.
     * @returns {Promise<Result<ResourceCostAllocationDTO>>} - A promise that resolves to a Result object containing the resource cost data.
     * - On success returns data as {@link ResourceCostAllocationDTO}.
     * - On failure returns status code and error message.
     */
    async getResourceCostAllocationByProjectId(projectId: number): Promise<Result<ResourceCostAllocationDTO>> {
        return await makeAPICall<ResourceCostAllocationDTO>(this.analyticsClient, this.errorHandlingService, {
            serviceName: SERVICES.ANALYTICS,
            method: HTTP_METHODS.GET,
            url: ANALYTICS_ROUTES.RESOURCE_COST_BY_PROJECT(projectId)
        });
    }

    /**
     * Fetches the profit margin analytics for a specific project.
     * @param {number} projectId - id of the project.
     * @returns {Promise<Result<ProfitMarginDTO>>} - A promise that resolves to a Result object containing the profit margin data.
     * - On success returns data as {@link ProfitMarginDTO}.
     * - On failure returns status code and error message.
     */
    async getProfitMarginByProjectId(projectId: number): Promise<Result<ProfitMarginDTO>> {
        return await makeAPICall<ProfitMarginDTO>(this.analyticsClient, this.errorHandlingService, {
            serviceName: SERVICES.ANALYTICS,
            method: HTTP_METHODS.GET,
            url: ANALYTICS_ROUTES.PROFIT_MARGIN_BY_PROJECT(projectId)
        });
    }

    async getProjectsLast30Days(): Promise<Result<TimeSeriesPointDto[]>> {
        return await makeAPICall<TimeSeriesPointDto[]>(
            this.analyticsClient,
            this.errorHandlingService,
            {
                serviceName: SERVICES.ANALYTICS,
                method: HTTP_METHODS.GET,
                url: ANALYTICS_ROUTES.PROJECTS_LAST_30_DAYS,
            }
        );
    }

    async getWorkersLast30Days(): Promise<Result<TimeSeriesPointDto[]>> {
        return await makeAPICall<TimeSeriesPointDto[]>(
            this.analyticsClient,
            this.errorHandlingService,
            {
                serviceName: SERVICES.ANALYTICS,
                method: HTTP_METHODS.GET,
                url: ANALYTICS_ROUTES.WORKERS_LAST_30_DAYS,
            }
        );
    }


}