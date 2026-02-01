import { Router, Request, Response } from "express";
import { IProjectAnalyticsService } from "../../Domain/services/IProjectAnalyticsService";
import { IFinancialAnalyticsService } from "../../Domain/services/IFinancialAnalyticsService";
import { ILogerService } from "../../Domain/services/ILogerService";
import { ISIEMService } from "../../siem/Domen/services/ISIEMService";
import { generateEvent } from "../../siem/Domen/Helpers/generate/GenerateEvent";
import { parseId } from "../../helpers/RequestParams";

export class AnalyticsController {
    private readonly router: Router;

    constructor(
        private projectAnalyticsService: IProjectAnalyticsService,
        private financialAnalyticsService: IFinancialAnalyticsService,
        private readonly logger: ILogerService,
        private readonly siemService: ISIEMService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {

        // Project Analytics
        //nakon implementacije dodati authorize i autenthicate

        this.router.get('/analytics/burndown/:sprintId', this.getBurndownAnalytics.bind(this));
        this.router.get('/analytics/burnup/:sprintId', this.getBurnupAnalytics.bind(this));
        this.router.get('/analytics/velocity/:projectId', this.getVelocityAnalytics.bind(this));
        this.router.get('/analytics/budget/:projectId', this.getBudgetTracking.bind(this));
        this.router.get('/analytics/resource-cost/:projectId', this.getResourceCostAllocation.bind(this));
        this.router.get('/analytics/profit-margin/:projectId', this.getProfitMargin.bind(this));
        this.router.get('/analytics/projects-last-30-days', this.getProjectsLast30Days.bind(this));
        this.router.get('/analytics/workers-last-30-days', this.getWorkersLast30Days.bind(this));

    }

    async getBurndownAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = parseId((req.params.sprint_id as string));

            if (sprintId === null) {
                const message = "Invalid sprint ID for Burndown";
                this.logger.log(message);
                res.status(400).json({ error: message });
                return;
            }


            if (isNaN(sprintId)) {
                const message = "Invalid sprint ID for Burndown";
                this.logger.log(message);
                res.status(400).json({ message: message });
                return;
            }

            this.logger.log(`Fetching burndown analytics for sprint ${sprintId}`);
            const result = await this.projectAnalyticsService.getBurnDownChartsForSprintId(sprintId);

            if (result.project_id === -1) {
                const message = `Burndown data not found for sprint ${sprintId}`;
                this.logger.log(message);
                this.siemService.sendEvent(
                    generateEvent("analytics-microservice", req, 404, message)
                );
                res.status(404).json({ message: message });
                return;
            }

            this.siemService.sendEvent(
                generateEvent(
                    "analytics-microservice",
                    req,
                    200,
                    "Request successful | Burndown data fetched"
                )
            );
            res.status(200).json(result);

        } catch (error) {
            this.logger.log((error as Error).message);
            this.siemService.sendEvent(
                generateEvent("analytics-microservice", req, 500, (error as Error).message)
            );
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getBurnupAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = parseId((req.params.sprintId as string));
            if (sprintId === null) {
                const message = "Invalid sprint ID for Burnup";
                this.logger.log(message);
                res.status(400).json({ error: message });
                return;
            }

            if (isNaN(sprintId)) {
                const message = "Invalid sprint ID for Burnup";
                this.logger.log(message);
                res.status(400).json({ message: message });
                return;
            }

            this.logger.log(`Fetching burnup analytics for sprint ${sprintId}`);
            const result = await this.projectAnalyticsService.getBurnUpChartsForSprintId(sprintId);

            if (result.project_id === -1) {
                const message = `Burnup data not found for sprint ${sprintId}`;
                this.logger.log(message);
                this.siemService.sendEvent(
                    generateEvent("analytics-microservice", req, 404, message)
                );
                res.status(404).json({ message: message });
                return;
            }

            this.siemService.sendEvent(
                generateEvent(
                    "analytics-microservice",
                    req,
                    200,
                    "Request successful | Burnup data fetched"
                )
            );

            res.status(200).json(result);

        } catch (error) {
            this.logger.log((error as Error).message);
            this.siemService.sendEvent(
                generateEvent("analytics-microservice", req, 500, (error as Error).message)
            );
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getVelocityAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const projectId = parseId((req.params.projectId as string));
            if (projectId === null) {
                const message = "Invalid project ID for Velocity";
                this.logger.log(message);
                res.status(400).json({ error: message });
                return;
            }
            if (isNaN(projectId)) {
                const message = "Invalid project ID for Velocity";
                this.logger.log(message);
                res.status(400).json({ message: message });
                return;
            }

            this.logger.log(`Fetching velocity analytics for project ${projectId}`);
            const result = await this.projectAnalyticsService.getVelocityForProject(projectId);

            if (result === -1) {
                const message = `Velocity data not found for project ${projectId}`;
                this.logger.log(message);
                this.siemService.sendEvent(
                    generateEvent("analytics-microservice", req, 404, message)
                );
                res.status(404).json({ message: message });
                return;
            }

            this.siemService.sendEvent(
                generateEvent(
                    "analytics-microservice",
                    req,
                    200,
                    "Request successful | Velocity data fetched"
                )
            );
            res.status(200).json(result);

        } catch (error) {
            this.logger.log((error as Error).message);
            this.siemService.sendEvent(
                generateEvent("analytics-microservice", req, 500, (error as Error).message)
            );
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getBudgetTracking(req: Request, res: Response): Promise<void> {
        try {
            const projectId = parseId((req.params.projectId as string));
            if (projectId === null) {
                const message = "Invalid project ID for Budget Tracking";
                this.logger.log(message);
                res.status(400).json({ error: message });
                return;
            }
            if (isNaN(projectId)) {
                const message = "Invalid project ID for Budget Tracking";
                this.logger.log(message);
                res.status(400).json({ message: message });
                return;
            }

            this.logger.log(`Fetching budget tracking analytics for project ${projectId}`);
            const result = await this.financialAnalyticsService.getBudgetTrackingForProject(projectId);

            if (result.allowed_budget === 0 && result.total_spent === 0 && result.remaining_budget === 0 && result.variance === 0) {
                const message = `Budget tracking data not found for project ${projectId}`;
                this.logger.log(message);
                this.siemService.sendEvent(
                    generateEvent("analytics-microservice", req, 404, message)
                );
                res.status(404).json({ message: message });
                return;
            }

            this.siemService.sendEvent(
                generateEvent(
                    "analytics-microservice",
                    req,
                    200,
                    "Request successful | Budget tracking data fetched"
                )
            );
            res.status(200).json(result);

        } catch (error) {
            this.logger.log((error as Error).message);
            this.siemService.sendEvent(
                generateEvent("analytics-microservice", req, 500, (error as Error).message)
            );
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getResourceCostAllocation(req: Request, res: Response): Promise<void> {
        try {
            const projectId = parseId((req.params.projectId as string));
            if (projectId === null) {
                const message = "Invalid project ID for Resource Cost Allocation";
                this.logger.log(message);
                res.status(400).json({ error: message });
                return;
            }
            if (isNaN(projectId)) {
                const message = "Invalid project ID for Resource Cost Allocation";
                this.logger.log(message);
                res.status(400).json({ message: message });
                return;
            }

            this.logger.log(`Fetching resource cost allocation for project ${projectId}`);
            const result = await this.financialAnalyticsService.getResourceCostAllocationForProject(projectId);

            if (result.resources.length === 0) {
                const message = `Resource cost allocation data not found for project ${projectId}`;
                this.logger.log(message);
                this.siemService.sendEvent(
                    generateEvent("analytics-microservice", req, 404, message)
                );
                res.status(404).json({ message: message });
                return;
            }

            this.siemService.sendEvent(
                generateEvent(
                    "analytics-microservice",
                    req,
                    200,
                    "Request successful | Resource cost allocation data fetched"
                )
            );
            res.status(200).json(result);

        } catch (error) {
            this.logger.log((error as Error).message);
            this.siemService.sendEvent(
                generateEvent("analytics-microservice", req, 500, (error as Error).message)
            );
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getProfitMargin(req: Request, res: Response): Promise<void> {
        try {
            const projectId = parseId((req.params.projectId as string));
            if (projectId === null) {
                const message = "Invalid project ID for Profit Margin";
                this.logger.log(message);
                res.status(400).json({ error: message });
                return;
            }
            if (isNaN(projectId)) {
                const message = "Invalid project ID for Profit Margin";
                this.logger.log(message);
                res.status(400).json({ message: message });
                return;
            }

            this.logger.log(`Fetching profit margin analytics for project ${projectId}`);
            const result = await this.financialAnalyticsService.getProfitMarginForProject(projectId);

            
            if (result.allowed_budget === 0 && result.total_cost ===0 && result.profit ===0 && result.profit_margin_percentage === 0) {
                const message = `Profit margin data not found for project ${projectId}`;
                this.logger.log(message);
                this.siemService.sendEvent(
                    generateEvent("analytics-microservice", req, 404, message)
                );
                res.status(404).json({ message: message });
                return;
            }

            this.siemService.sendEvent(
                generateEvent(
                    "analytics-microservice",
                    req,
                    200,
                    "Request successful | Profit margin data fetched"
                )
            );
            res.status(200).json(result);

        } catch (error) {
            this.logger.log((error as Error).message);
            this.siemService.sendEvent(
                generateEvent("analytics-microservice", req, 500, (error as Error).message)
            );
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getProjectsLast30Days(req: Request, res: Response): Promise<void> {
        try {
            this.logger.log("Fetching projects started in last 30 days");
            const result =
                await this.projectAnalyticsService.getProjectsStartedLast30Days();

            res.status(200).json(result);
        } catch (error) {
            this.logger.log((error as Error).message);
            this.siemService.sendEvent(
                generateEvent("analytics-microservice", req, 500, (error as Error).message)
            );
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getWorkersLast30Days(req: Request, res: Response): Promise<void> {
        console.log("Received request for workers added in last 30 days");
        try {
            const result =
                await this.projectAnalyticsService.getWorkersAddedLast30Days();
            console.log("Returning result:", result);
    
            res.status(200).json(result);
        } catch (error) {
            this.logger.log((error as Error).message);
            this.siemService.sendEvent(
                generateEvent("analytics-microservice", req, 500, (error as Error).message)
            );
            res.status(500).json({ message: (error as Error).message });
        }
    }


    public getRouter(): Router {
        return this.router;
    }
}
