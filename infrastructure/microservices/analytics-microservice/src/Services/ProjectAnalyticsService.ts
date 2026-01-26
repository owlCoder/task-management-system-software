import { IProjectAnalyticsService } from "../Domain/services/IProjectAnalyticsService";
import { BurndownDto } from "../Domain/DTOs/BurndownDto";
import { BurndownTaskDTO } from "../Domain/DTOs/BurndownTaskDto";
import { BurnupDto } from "../Domain/DTOs/BurnupDto";
import { BurnupPointDto } from "../Domain/DTOs/BurnupPointDto";
import { buildLast30DaysMap } from "../helpers/Last30Days";
import { TimeSeriesPointDto } from "../Domain/DTOs/TimeSeriesPointDto";
import { roundToTwo } from "../helpers/RoundToTwo";
import { IProjectServiceClient } from "./external-services/IProjectServiceClient";
import { ITaskServiceClient } from "./external-services/ITaskServiceClient";

export class ProjectAnalyticsService implements IProjectAnalyticsService {

    constructor(
        private readonly projectServiceClient: IProjectServiceClient,
        private readonly taskServiceClient: ITaskServiceClient,
    ) { }

    async getBurnDownChartsForSprintId(sprintId: number): Promise<BurndownDto> {
        // Fetch sprint by ID - potreban nam endpoint
        const s = await this.projectServiceClient.getSprintById(sprintId);

        if (!s) return { project_id: -1, sprint_id: -1, tasks: [] };

        const project = await this.projectServiceClient.getProjectById(s.project_id);

        if (!project) return { project_id: -1, sprint_id: sprintId, tasks: [] };

        const startDate = new Date(s.start_date);
        const endDate = new Date(s.end_date);

        const time = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

        const tasks = await this.taskServiceClient.getTasksBySprintIds([sprintId]);

        let sum = 0;

        for (let i = 0; i < tasks.length; ++i)
            sum += tasks[i].estimated_cost;

        if (sum === 0) sum = 1; // to avoid division by zero

        let BurndownTasks: BurndownTaskDTO[] = [];

        for (let i = 0; i < tasks.length; ++i) {
            let ideal = time * (tasks[i].estimated_cost / sum);
            let real = tasks[i].total_hours_spent;

            BurndownTasks.push({
                task_id: tasks[i].task_id,
                task_name: tasks[i].title,
                ideal_progress: roundToTwo(ideal),
                real_progress: roundToTwo(real),
            });
        }

        return { project_id: project.project_id, sprint_id: s.sprint_id, tasks: BurndownTasks };
    }

    async getBurnUpChartsForSprintId(sprintId: number): Promise<BurnupDto> {
        const s = await this.projectServiceClient.getSprintById(sprintId);

        if (!s) return { project_id: -1, sprint_id: -1, sprint_duration_date: 0, work_amount: 0, points: [] };

        const project = await this.projectServiceClient.getProjectById(s.project_id);

        if (!project) return { project_id: -1, sprint_id: sprintId, sprint_duration_date: 0, work_amount: 0, points: [] };

        const startDate = new Date(s.start_date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(s.end_date);
        endDate.setHours(23, 59, 59, 999);

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const sprintDuration =
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

        const tasks = await this.taskServiceClient.getTasksBySprintIds([sprintId]);

        const finishedTasks = tasks
            .filter(t => {
                return t.finished_at;
            })
            .map(t => ({ ...t, finished_at_date: new Date(t.finished_at!) }))
            .filter(t => {
                const inRange = t.finished_at_date >= startDate && t.finished_at_date <= endDate && t.finished_at_date <= today;
                return inRange;
            })
            .sort((a, b) => a.finished_at_date.getTime() - b.finished_at_date.getTime());



        const totalWork = tasks.reduce((sum, t) => sum + t.estimated_cost, 0);

        const points: BurnupPointDto[] = [];
        let cumulativeWork = 0;

        for (const task of finishedTasks) {
            cumulativeWork += task.estimated_cost;

            const dayFromStart =
                (task.finished_at_date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

            points.push({
                x: Math.floor(dayFromStart),
                y: roundToTwo(cumulativeWork),
            });
        }

        return {
            project_id: project.project_id,
            sprint_id: s.sprint_id,
            sprint_duration_date: Math.ceil(sprintDuration),
            work_amount: totalWork,
            points,
        };
    }

    async getVelocityForProject(projectId: number): Promise<number> {
        const proj = await this.projectServiceClient.getProjectById(projectId);

        if (!proj) return -1;

        // fetch sprints koje su završene do danas, po projectId
        const allSprints = await this.projectServiceClient.getSprintsByProject(projectId);

        const today = new Date();
        const sprints = allSprints.filter(s => new Date(s.end_date) < today);

        if (sprints.length === 0) return -1;

        let sumMs = 0;

        for (const sprint of sprints) {
            const start = new Date(sprint.start_date);
            const end = new Date(sprint.end_date);
            sumMs += end.getTime() - start.getTime();
        }

        // average hours per sprint
        const avgHours = (sumMs / sprints.length) / (1000 * 60 * 60);

        return parseFloat(roundToTwo(avgHours).toString());
    }

    async getProjectsStartedLast30Days(): Promise<TimeSeriesPointDto[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);

        const projects = await this.projectServiceClient.getProjectsStartedAfter(startDate);

        const map = buildLast30DaysMap();

        for (const project of projects) {
            if (!project.start_date) continue;

            const key = project.start_date.slice(0, 10);

            if (map.has(key)) {
                map.set(key, map.get(key)! + 1);
            }
        }

        return Array.from(map.entries()).map(([date, count]) => ({
            date,
            count,
        }));
    }

    async getWorkersAddedLast30Days(): Promise<TimeSeriesPointDto[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);

        const projectUsers = await this.projectServiceClient.getProjectUsersAddedAfter(startDate);

        const map = buildLast30DaysMap();

        for (const pu of projectUsers) {
            const key = new Date(pu.added_at).toISOString().slice(0, 10);

            if (map.has(key)) {
                map.set(key, map.get(key)! + 1);
            }
        }

        return Array.from(map.entries()).map(([date, count]) => ({
            date,
            count,
        }));
    }
}