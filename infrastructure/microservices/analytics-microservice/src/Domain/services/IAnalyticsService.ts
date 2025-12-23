import { BurndownDto } from "../DTOs/BurndownDto";

export interface IAnalyticsService {
    getBurnDownChartsForSprintId(sprintId: number): Promise<BurndownDto>;
    // getBurnUpChartsForSprintId(sprintId: number): Promise<BurnupDto>;
    getVelocityForProject(projectId: number): Promise<number>;

}