import { Router, Request, Response } from "express";
import { IGatewayAnalyticsService } from "../../Domain/services/analytics/IGatewayAnalyticsService";
import { BurndownDTO } from "../../Domain/DTOs/analytics/BurndownDTO";
import { BurnupDTO } from "../../Domain/DTOs/analytics/BurnupDTO";
import { BudgetTrackingDTO } from "../../Domain/DTOs/analytics/BudgetTrackingDTO";
import { ResourceCostAllocationDTO } from "../../Domain/DTOs/analytics/ResourceCostAllocationDTO";
import { ProfitMarginDTO } from "../../Domain/DTOs/analytics/ProfitMarginDTO";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/user/UserRole";

export class GatewayAnalyticsController {
    private readonly router: Router;

    constructor(private readonly gatewayAnalyticsService: IGatewayAnalyticsService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/analytics/burndown/:sprintId', authenticate, authorize(UserRole.ANALYTICS_DEVELOPMENT_MANAGER), this.getBurndownAnalyticsBySprintId.bind(this));
        this.router.get('/analytics/burnup/:sprintId', authenticate, authorize(UserRole.ANALYTICS_DEVELOPMENT_MANAGER), this.getBurnupAnalyticsBySprintId.bind(this));
        this.router.get('/analytics/velocity/:projectId', authenticate, authorize(UserRole.ANALYTICS_DEVELOPMENT_MANAGER), this.getVelocityAnalyticsByProjectId.bind(this));
        this.router.get('/analytics/budget/:projectId', authenticate, authorize(UserRole.ANALYTICS_DEVELOPMENT_MANAGER), this.getBudgetTrackingByProjectId.bind(this));
        this.router.get('/analytics/resource-cost/:projectId', authenticate, authorize(UserRole.ANALYTICS_DEVELOPMENT_MANAGER), this.getResourceCostAllocationByProjectId.bind(this));
        this.router.get('/analytics/profit-margin/:projectId', authenticate, authorize(UserRole.ANALYTICS_DEVELOPMENT_MANAGER), this.getProfitMarginByProjectId.bind(this));
    }

    /**
     * GET /api/v1/analytics/burndown/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link BurndownDTO} structure containing the result of the get burndown analytics by sprint id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getBurndownAnalyticsBySprintId(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId);

        const result = await this.gatewayAnalyticsService.getBurndownAnalyticsBySprintId(sprintId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * GET /api/v1/analytics/burnup/:sprintId
     * @param {Request} req - the request object, containing the id of the sprint in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link BurnupDTO} structure containing the result of the get burnup analytics by sprint id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getBurnupAnalyticsBySprintId(req: Request, res: Response): Promise<void> {
        const sprintId = parseInt(req.params.sprintId);

        const result = await this.gatewayAnalyticsService.getBurnupAnalyticsBySprintId(sprintId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * GET /api/v1/analytics/velocity/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object containing the number that represents the result of the get velocity analytics by project id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getVelocityAnalyticsByProjectId(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId);

        const result = await this.gatewayAnalyticsService.getVelocityAnalyticsByProjectId(projectId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * GET /api/v1/analytics/budget/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link BudgetTrackingDTO} structure containing the result of the get budget tracking by project id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getBudgetTrackingByProjectId(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId);

        const result = await this.gatewayAnalyticsService.getBudgetTrackingByProjectId(projectId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * GET /api/v1/analytics/resource-cost/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ResourceCostAllocationDTO} structure containing the result of the get resource cost by project id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getResourceCostAllocationByProjectId(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId);

        const result = await this.gatewayAnalyticsService.getResourceCostAllocationByProjectId(projectId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }
    
    /**
     * GET /api/v1/analytics/profit-margin/:projectId
     * @param {Request} req - the request object, containing the id of the project in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link ProfitMarginDTO} structure containing the result of the get profit margin by project id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getProfitMarginByProjectId(req: Request, res: Response): Promise<void> {
        const projectId = parseInt(req.params.projectId);

        const result = await this.gatewayAnalyticsService.getProfitMarginByProjectId(projectId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    public getRouter(): Router {
        return this.router;
    }
}