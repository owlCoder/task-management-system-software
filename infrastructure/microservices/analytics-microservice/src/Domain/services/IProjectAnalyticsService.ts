import { BurndownDto } from "../DTOs/BurndownDto";
import { BurnupDto } from "../DTOs/BurnupDto";

export interface IProjectAnalyticsService {
    getBurnDownChartsForSprintId(sprintId: number): Promise<BurndownDto>;
    getBurnUpChartsForSprintId(sprintId: number): Promise<BurnupDto>;
    getVelocityForProject(projectId: number): Promise<number>;

}