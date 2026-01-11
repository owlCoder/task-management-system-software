// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayAnalyticsService } from "../../../Domain/services/analytics/IGatewayAnalyticsService";
import { BurndownDTO } from "../../../Domain/DTOs/analytics/BurndownDTO";
import { BurnupDTO } from "../../../Domain/DTOs/analytics/BurnupDTO";
import { BudgetTrackingDTO } from "../../../Domain/DTOs/analytics/BudgetTrackingDTO";
import { ResourceCostAllocationDTO } from "../../../Domain/DTOs/analytics/ResourceCostAllocationDTO";
import { ProfitMarginDTO } from "../../../Domain/DTOs/analytics/ProfitMarginDTO";
import { AnalyticsPolicies } from "../../../Domain/access-policies/analytics/AnalyticsPolicies";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Utils
import { handleResponse } from "../../Utils/Http/ResponseHandler";

/**
 * Routes client requests towards the Analytics Microservice.
 */
export class GatewayAnalyticsController {
    private readonly router: Router;

    constructor(private readonly gatewayAnalyticsService: IGatewayAnalyticsService) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for Analytics Microservice.
     */
    private initializeRoutes() {
        const analyticsReadonlyAccess = [authenticate, authorize(...AnalyticsPolicies.READONLY)];

        this.router.get('/analytics/burndown/:sprintId', ...analyticsReadonlyAccess, this.getBurndownAnalyticsBySprintId.bind(this));
        this.router.get('/analytics/burnup/:sprintId', ...analyticsReadonlyAccess, this.getBurnupAnalyticsBySprintId.bind(this));
        this.router.get('/analytics/velocity/:projectId', ...analyticsReadonlyAccess, this.getVelocityAnalyticsByProjectId.bind(this));
        this.router.get('/analytics/budget/:projectId', ...analyticsReadonlyAccess, this.getBudgetTrackingByProjectId.bind(this));
        this.router.get('/analytics/resource-cost/:projectId', ...analyticsReadonlyAccess, this.getResourceCostAllocationByProjectId.bind(this));
        this.router.get('/analytics/profit-margin/:projectId', ...analyticsReadonlyAccess, this.getProfitMarginByProjectId.bind(this));
    }

    /**
     * GET /api/v1/analytics/burndown/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link BurndownDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getBurndownAnalyticsBySprintId(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId as string, 10);
        
        const result = await this.gatewayAnalyticsService.getBurndownAnalyticsBySprintId(sprintId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/analytics/burnup/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link BurnupDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getBurnupAnalyticsBySprintId(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId as string, 10);

        const result = await this.gatewayAnalyticsService.getBurnupAnalyticsBySprintId(sprintId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/analytics/velocity/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: number representing the velocity. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getVelocityAnalyticsByProjectId(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId as string, 10);

        const result = await this.gatewayAnalyticsService.getVelocityAnalyticsByProjectId(projectId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/analytics/budget/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link BudgetTrackingDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getBudgetTrackingByProjectId(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId as string, 10);

        const result = await this.gatewayAnalyticsService.getBudgetTrackingByProjectId(projectId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/analytics/resource-cost/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ResourceCostAllocationDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getResourceCostAllocationByProjectId(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId as string, 10);

        const result = await this.gatewayAnalyticsService.getResourceCostAllocationByProjectId(projectId);
        handleResponse(res, result);
    }
    
    /**
     * GET /api/v1/analytics/profit-margin/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link ProfitMarginDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getProfitMarginByProjectId(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId as string, 10);

        const result = await this.gatewayAnalyticsService.getProfitMarginByProjectId(projectId);
        handleResponse(res, result)
    }

    public getRouter(): Router {
        return this.router;
    }
}