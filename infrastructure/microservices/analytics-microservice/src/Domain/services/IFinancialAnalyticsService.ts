import { BudgetTrackingDto } from "../DTOs/BudgetTrackingDto";

export interface IFinancialAnalyticsService {
    getBudgetTrackingForProject(projectId: number): Promise<BudgetTrackingDto>;
}