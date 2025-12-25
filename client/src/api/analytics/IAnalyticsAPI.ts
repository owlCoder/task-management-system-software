import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { BurndownDto } from "../../models/analytics/BurndownDto";
import { BurnupDto } from "../../models/analytics/BurnupDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";

export interface IAnalyticsAPI {
  getBurndownAnalytics(sprintId: string): Promise<BurndownDto>
  getBurnupAnalytics(sprintId: string): Promise<BurnupDto>
  getVelocityTracking(projectId: string): Promise<number>
  getBudgetTracking(projectId: string): Promise<BudgetTrackingDto>;
  getProfitMargin(projectId: string): Promise<ProfitMarginDto>;
  getResourceCostAllocation(projectId: string): Promise<ResourceCostAllocationDto>;
}