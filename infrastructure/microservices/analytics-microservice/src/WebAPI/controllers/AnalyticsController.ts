import { Router, Request, Response } from "express";
import { IProjectAnalyticsService } from "../../Domain/services/IProjectAnalyticsService";
import { IFinancialAnalyticsService } from "../../Domain/services/IFinancialAnalyticsService";

export class AnalyticsController {
    private readonly router: Router;

    constructor(private projectAnalyticsService: IProjectAnalyticsService,
        private financialAnalyticsService: IFinancialAnalyticsService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private getParamAsString(param: string | string[] | undefined): string | null {
        if (!param) return null;
        return Array.isArray(param) ? param[0] : param;
    }

    private parseId(param: string | string[] | undefined): number | null {
        const s = this.getParamAsString(param);
        if (!s) return null;

        const n = Number.parseInt(s, 10);
        return Number.isFinite(n) ? n : null;
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
    }

    async getBurndownAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = this.parseId((req.params as any).sprintId);

            if (sprintId === null) {
                res.status(400).json({ error: "Invalid sprintId" });
                return;
            }


            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID for Burndown" });
                return;
            }

            const result = await this.projectAnalyticsService.getBurnDownChartsForSprintId(sprintId);

            if (!result) {
                res.status(404).json({ message: "Burndown data not found" });
                return;
            }

            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getBurnupAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = this.parseId((req.params as any).sprintId);
            if (sprintId === null) {
                res.status(400).json({ error: "Invalid sprintId" });
                return;
            }

            if (isNaN(sprintId)) {
                res.status(400).json({ message: "Invalid sprint ID for Burnup" });
                return;
            }

            const result = await this.projectAnalyticsService.getBurnUpChartsForSprintId(sprintId);

            if (!result) {
                res.status(404).json({ message: "Burnup data not found" });
                return;
            }


            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getVelocityAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const projectId = this.parseId((req.params as any).projectId);
            if (projectId === null) {
                res.status(400).json({ error: "Invalid projectId" });
                return;
            }
            if (isNaN(projectId)) {
                res.status(400).json({ message: "Invalid project ID for Velocity" });
                return;
            }

            const result = await this.projectAnalyticsService.getVelocityForProject(projectId);

            if (!result) {
                res.status(404).json({ message: "Velocity data not found" });
                return;
            }

            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getBudgetTracking(req: Request, res: Response): Promise<void> {
        try {
            const projectId = this.parseId((req.params as any).projectId);
            if (projectId === null) {
                res.status(400).json({ error: "Invalid projectId" });
                return;
            }
            if (isNaN(projectId)) {
                res.status(400).json({ message: "Invalid project ID for Budget Tracking" });
                return;
            }

            const result = await this.financialAnalyticsService.getBudgetTrackingForProject(projectId);

            if (!result) {
                res.status(404).json({ message: "Budget tracking data not found" });
                return;
            }

            res.status(200).json(result);

        } catch {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getResourceCostAllocation(req: Request, res: Response): Promise<void> {
        try {
            const projectId = this.parseId((req.params as any).projectId);
            if (projectId === null) {
                res.status(400).json({ error: "Invalid projectId" });
                return;
            }
            if (isNaN(projectId)) {
                res.status(400).json({ message: "Invalid project ID for Resource Cost Allocation" });
                return;
            }

            const result = await this.financialAnalyticsService.getResourceCostAllocationForProject(projectId);

            if (!result) {
                res.status(404).json({ message: "Resource cost allocation data not found" });
                return;
            }

            res.status(200).json(result);

        } catch {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getProfitMargin(req: Request, res: Response): Promise<void> {
        try {
            const projectId = this.parseId((req.params as any).projectId);
            if (projectId === null) {
                res.status(400).json({ error: "Invalid projectId" });
                return;
            }
            if (isNaN(projectId)) {
                res.status(400).json({ message: "Invalid project ID for Profit Margin" });
                return;
            }

            const result = await this.financialAnalyticsService.getProfitMarginForProject(projectId);

            if (!result) {
                res.status(404).json({ message: "Profit margin data not found" });
                return;
            }

            res.status(200).json(result);

        } catch {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}