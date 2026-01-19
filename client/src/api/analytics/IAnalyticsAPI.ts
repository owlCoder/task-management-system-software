import { BurndownDto } from "../../models/analytics/BurndownDto";
import { BurnupDto } from "../../models/analytics/BurnupDto";
import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";

type Id = string | number;

export interface IAnalyticsAPI {
  getBurndownAnalytics(sprintId: Id, token: string): Promise<BurndownDto>;
  getBurnupAnalytics(sprintId: Id, token: string): Promise<BurnupDto>;
  getVelocityTracking(projectId: Id, token: string): Promise<number>;
  getBudgetTracking(projectId: Id, token: string): Promise<BudgetTrackingDto>;
  getProfitMargin(projectId: Id, token: string): Promise<ProfitMarginDto>;
  getResourceCostAllocation(projectId: Id, token: string): Promise<ResourceCostAllocationDto>;
}