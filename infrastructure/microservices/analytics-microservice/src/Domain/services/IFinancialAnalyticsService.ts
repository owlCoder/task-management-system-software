import { BudgetTrackingDto } from "../DTOs/BudgetTrackingDto";
import { ResourceCostAllocationDto } from "../DTOs/ResourceCostAllocationDto";

export interface IFinancialAnalyticsService {
    getBudgetTrackingForProject(projectId: number): Promise<BudgetTrackingDto>;
    getResourceCostAllocationForProject(projectId: number): Promise<ResourceCostAllocationDto>;
}