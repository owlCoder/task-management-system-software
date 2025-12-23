import { BudgetTrackingDto } from "../DTOs/BudgetTrackingDto";
import { ResourceCostAllocationDto } from "../DTOs/ResourceCostAllocationDto";
import { ProfitMarginDto } from "../DTOs/ProfitMarginDto";

export interface IFinancialAnalyticsService {
    getBudgetTrackingForProject(projectId: number): Promise<BudgetTrackingDto>;
    getResourceCostAllocationForProject(projectId: number): Promise<ResourceCostAllocationDto>;
    getProfitMarginForProject(projectId: number): Promise<ProfitMarginDto>;
}