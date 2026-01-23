import { BudgetTrackingDTO } from "../../DTOs/analytics/BudgetTrackingDTO";
import { BurndownDTO } from "../../DTOs/analytics/BurndownDTO";
import { BurnupDTO } from "../../DTOs/analytics/BurnupDTO";
import { ProfitMarginDTO } from "../../DTOs/analytics/ProfitMarginDTO";
import { ResourceCostAllocationDTO } from "../../DTOs/analytics/ResourceCostAllocationDTO";
import { TimeSeriesPointDto } from "../../DTOs/analytics/TimeSeriesPointDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayAnalyticsService {
    getBurndownAnalyticsBySprintId(sprintId: number): Promise<Result<BurndownDTO>>;
    getBurnupAnalyticsBySprintId(sprintId: number): Promise<Result<BurnupDTO>>;
    getVelocityAnalyticsByProjectId(projectId: number): Promise<Result<number>>;
    getBudgetTrackingByProjectId(projectId: number): Promise<Result<BudgetTrackingDTO>>;
    getResourceCostAllocationByProjectId(projectId: number): Promise<Result<ResourceCostAllocationDTO>>;
    getProfitMarginByProjectId(projectId: number): Promise<Result<ProfitMarginDTO>>;
    getProjectsLast30Days(): Promise<Result<TimeSeriesPointDto[]>>;
    getWorkersLast30Days(): Promise<Result<TimeSeriesPointDto[]>>;

}