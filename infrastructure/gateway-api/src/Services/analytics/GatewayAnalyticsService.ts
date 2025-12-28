// Libraries
import axios, { AxiosInstance } from "axios";

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

export class GatewayAnalyticsService implements IGatewayAnalyticsService {
    private readonly analyticsClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.analyticsClient = axios.create({
            baseURL: API_ENDPOINTS.ANALYTICS,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async getBurndownAnalyticsBySprintId(sprintId: number): Promise<Result<BurndownDTO>> {
        try {
            const response = await this.analyticsClient.get<BurndownDTO>(ANALYTICS_ROUTES.BURNDOWN_BY_SPRINT(sprintId));

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.ANALYTICS, HTTP_METHODS.GET, ANALYTICS_ROUTES.BURNDOWN_BY_SPRINT(sprintId));
        }
    }

    async getBurnupAnalyticsBySprintId(sprintId: number): Promise<Result<BurnupDTO>> {
        try {
            const response = await this.analyticsClient.get<BurnupDTO>(ANALYTICS_ROUTES.BURNUP_BY_SPRINT(sprintId));

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.ANALYTICS, HTTP_METHODS.GET, ANALYTICS_ROUTES.BURNUP_BY_SPRINT(sprintId));
        }
    }

    async getVelocityAnalyticsByProjectId(projectId: number): Promise<Result<number>> {
        try {
            const response = await this.analyticsClient.get<number>(ANALYTICS_ROUTES.VELOCITY_BY_PROJECT(projectId));

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.ANALYTICS, HTTP_METHODS.GET, ANALYTICS_ROUTES.VELOCITY_BY_PROJECT(projectId));
        }
    }

    async getBudgetTrackingByProjectId(projectId: number): Promise<Result<BudgetTrackingDTO>> {
        try {
            const response = await this.analyticsClient.get<BudgetTrackingDTO>(ANALYTICS_ROUTES.BUDGET_BY_PROJECT(projectId));

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.ANALYTICS, HTTP_METHODS.GET, ANALYTICS_ROUTES.BUDGET_BY_PROJECT(projectId));
        }
    }

    async getResourceCostAllocationByProjectId(projectId: number): Promise<Result<ResourceCostAllocationDTO>> {
        try {
            const response = await this.analyticsClient.get<ResourceCostAllocationDTO>(ANALYTICS_ROUTES.RESOURCE_COST_BY_PROJECT(projectId));

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.ANALYTICS, HTTP_METHODS.GET, ANALYTICS_ROUTES.RESOURCE_COST_BY_PROJECT(projectId));
        }
    }

    async getProfitMarginByProjectId(projectId: number): Promise<Result<ProfitMarginDTO>> {
        try {
            const response = await this.analyticsClient.get<ProfitMarginDTO>(ANALYTICS_ROUTES.PROFIT_MARGIN_BY_PROJECT(projectId));

            return {
                success: true,
                data: response.data
            }
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.ANALYTICS, HTTP_METHODS.GET, ANALYTICS_ROUTES.PROFIT_MARGIN_BY_PROJECT(projectId));
        }
    }

}