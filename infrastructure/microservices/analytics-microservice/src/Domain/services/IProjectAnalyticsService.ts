import { BurndownDto } from "../DTOs/BurndownDto";
import { BurnupDto } from "../DTOs/BurnupDto";
import { TimeSeriesPointDto } from "../DTOs/TimeSeriesPointDto";

export interface IProjectAnalyticsService {
    getBurnDownChartsForSprintId(sprintId: number): Promise<BurndownDto>;
    getBurnUpChartsForSprintId(sprintId: number): Promise<BurnupDto>;
    getVelocityForProject(projectId: number): Promise<number>;
    getProjectsStartedLast30Days(): Promise<TimeSeriesPointDto[]>;
    getWorkersAddedLast30Days(): Promise<TimeSeriesPointDto[]>;

}