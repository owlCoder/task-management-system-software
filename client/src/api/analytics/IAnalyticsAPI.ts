import { BurndownDto } from "../../models/analytics/BurndownDto";
import { BurnupDto } from "../../models/analytics/BurnupDto";
import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";
import { TimeSeriesPointDto } from "../../models/analytics/TimeSeriesPointDto";
import { BusinessLLMOutputDTO } from "../../models/analytics/BusinessInsightDto";

type Id = string | number;

export interface IAnalyticsAPI {
  getBurndownAnalytics(sprintId: Id, token: string): Promise<BurndownDto>;
  getBurnupAnalytics(sprintId: Id, token: string): Promise<BurnupDto>;
  getVelocityTracking(projectId: Id, token: string): Promise<number>;
  getBudgetTracking(projectId: Id, token: string): Promise<BudgetTrackingDto>;
  getProfitMargin(projectId: Id, token: string): Promise<ProfitMarginDto>;
  getResourceCostAllocation(projectId: Id, token: string): Promise<ResourceCostAllocationDto>;
  getProjectsLast30Days(token: string): Promise<TimeSeriesPointDto[]>;
  getWorkersLast30Days(token: string): Promise<TimeSeriesPointDto[]>;
  getBusinessInsights(from: string, to: string, token: string): Promise<BusinessLLMOutputDTO>;
}