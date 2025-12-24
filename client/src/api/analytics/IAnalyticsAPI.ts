import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";

export interface IAnalyticsAPI {
  getBudgetTracking(projectId: string): Promise<BudgetTrackingDto>;
  getProfitMargin(projectId: string): Promise<ProfitMarginDto>;
  getResourceCostAllocation(projectId: string): Promise<ResourceCostAllocationDto>;
}