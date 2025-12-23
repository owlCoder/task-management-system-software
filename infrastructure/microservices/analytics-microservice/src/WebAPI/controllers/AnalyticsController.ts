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

    private initializeRoutes() {

        // Project Analytics
        //nakon implementacije dodati authorize i autenthicate

        this.router.get('/analytics/burndown/:sprintId', this.getBurndownAnalytics.bind(this));
        this.router.get('/analytics/burnup/:sprintId', this.getBurnupAnalytics.bind(this));
        this.router.get('/analytics/velocity/:projectId', this.getVelocityAnalytics.bind(this));

    }

    async getBurndownAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const sprintId = parseInt(req.params.sprintId, 10);
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
            const sprintId = parseInt(req.params.sprintId, 10);
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
            const projectId = parseInt(req.params.projectId, 10);
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

    public getRouter(): Router {
        return this.router;
    }
}