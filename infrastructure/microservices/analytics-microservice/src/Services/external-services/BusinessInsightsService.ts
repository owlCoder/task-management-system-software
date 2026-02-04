import { BusinessLLMInputDto, ProjectFinancialMetricsDto, ProjectPerformanceMetricsDto } from "../../Domain/DTOs/BusinessLLMInputDto";
import { IFinancialAnalyticsService } from "../../Domain/services/IFinancialAnalyticsService";
import { IProjectAnalyticsService } from "../../Domain/services/IProjectAnalyticsService";
import { IBusinessInsightsService } from "./IBusinessInsightsService";
import { IProjectServiceClient } from "./IProjectServiceClient";
import { ILLMAnalyticsService } from "./ILLMAnalyticsService";
import { BusinessLLMOutputDTO } from "../../Domain/DTOs/BusinessLLMOutputDto";

export class BusinessInsightsService implements IBusinessInsightsService {
    constructor(
        private readonly projectAnalyticsService: IProjectAnalyticsService,
        private readonly financialAnalyticsService: IFinancialAnalyticsService,
        private readonly projectServiceClient: IProjectServiceClient,
        private readonly llmAnalyticsService: ILLMAnalyticsService
    ) {}

    private async buildLLMInput(
        from: string,
        to: string
    ): Promise<BusinessLLMInputDto> {
        // 1) Activity metrics: poslednjih 30 dana
        const projectLast30 = await this.projectAnalyticsService.getProjectsStartedLast30Days();
        const workersLast30 = await this.projectAnalyticsService.getWorkersAddedLast30Days();

        const activity = {
            projects_started_last_30_days: projectLast30.reduce((sum, p) => sum + p.count, 0),
            workers_added_last_30_days: workersLast30.reduce((sum, w) => sum + w.count, 0),
        }
        
        // 2) Projekti u zadatom periodu
        const fromDate = new Date(from);
        const projects = await this.projectServiceClient.getProjectsStartedAfter(fromDate);
        console.log("Projects from getProjectsStartedAfter:", projects);

        const performanceMetrics: ProjectPerformanceMetricsDto[] = [];
        const financialMetrics: ProjectFinancialMetricsDto[] = [];

        const today = new Date(from);

        for(const project of projects) {
            // Performance

            const velocity = await this.projectAnalyticsService.getVelocityForProject(project.project_id);
            const allSprints = await this.projectServiceClient.getSprintsByProject(project.project_id);

            const completedSprints = allSprints.filter(s => {
                const end = new Date(s.end_date);
                return end < today;
            });

            performanceMetrics.push({
                project_id: project.project_id,
                average_velocity_hours: velocity >= 0 ? velocity : 0,
                sprints_completed: completedSprints.length
            });

            // Financials

            const budget = await this.financialAnalyticsService.getBudgetTrackingForProject(project.project_id);
            const profit = await this.financialAnalyticsService.getProfitMarginForProject(project.project_id);

            financialMetrics.push({
                project_id: project.project_id,
                allowed_budget: budget.allowed_budget,
                total_spent: budget.total_spent,
                remaining_budget: budget.remaining_budget,
                variance: budget.variance,
                profit: profit.profit,
                profit_margin_percentage: profit.profit_margin_percentage
            });
        }

        const input: BusinessLLMInputDto = {
                timeWindow: { from, to },
                activity,
                projects_performance: performanceMetrics,
                projects_financials: financialMetrics
            };

            return input;
    }

    
    public async generateInsights(from: string, to: string): Promise<BusinessLLMOutputDTO> {
        const input = await this.buildLLMInput(from, to);
        return await this.llmAnalyticsService.analyze(input);
    }
}