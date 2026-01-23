import { LessThan, Repository } from "typeorm";
import { IProjectAnalyticsService } from "../Domain/services/IProjectAnalyticsService";
import { Task } from "../Domain/models/Task";
import { Sprint } from "../Domain/models/Sprint";
import { Project } from "../Domain/models/Project";
import { BurndownDto } from "../Domain/DTOs/BurndownDto";
import { BurndownTaskDTO } from "../Domain/DTOs/BurndownTaskDto";
import { BurnupDto } from "../Domain/DTOs/BurnupDto";
import { BurnupPointDto } from "../Domain/DTOs/BurnupPointDto";
import { MoreThanOrEqual } from "typeorm";
import { buildLast30DaysMap } from "../helpers/Last30Days";
import { TimeSeriesPointDto } from "../Domain/DTOs/TimeSeriesPointDto";
import { ProjectUser } from "../Domain/models/ProjectUser";
import { roundToTwo } from "../helpers/RoundToTwo";


export class ProjectAnalyticsService implements IProjectAnalyticsService {

    constructor(
        private readonly taskRepository: Repository<Task>,
        private readonly sprintRepository: Repository<Sprint>,
        private readonly projectRepository: Repository<Project>,
        private readonly projectUserRepository: Repository<ProjectUser>,
    ) { }

    async getBurnDownChartsForSprintId(sprintId: number): Promise<BurndownDto> {

        const s = await this.sprintRepository.findOne({
            where: { sprint_id: sprintId },
        });

        if (!s) throw new Error("Sprint not found");

        const project = await this.projectRepository.findOne({
            where: { project_id: s.project_id },
        });

        if (!project) throw new Error("Project not found for sprint");

        const startDate = new Date(s.start_date);
        const endDate = new Date(s.end_date);

        const time = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

        const tasksFromSprint = await this.taskRepository.find({ where: { sprint_id: sprintId } });

        // Ako Task ne zna za project_id, filtriraj po sprintu koji već znamo da je za dati project:
        const tasks = tasksFromSprint.filter(t => t.sprint_id === s.sprint_id);



        let sum = 0;

        for (let i = 0; i < tasks.length; ++i)
            sum += tasks[i].estimated_cost;

        if (sum === 0) sum = 1; //to avoid division by zero

        let BurndownTasks: BurndownTaskDTO[] = [];

        for (let i = 0; i < tasks.length; ++i) {
            let ideal = time * (tasks[i].estimated_cost / sum);
            let real = tasks[i].total_hours_spent;

            BurndownTasks.push({
                task_id: tasks[i].task_id,
                ideal_progress: roundToTwo(ideal),
                real_progress: roundToTwo(real),
            });
        }

        return { project_id: project.project_id, sprint_id: s.sprint_id, tasks: BurndownTasks };
    }

    async getBurnUpChartsForSprintId(sprintId: number): Promise<BurnupDto> {
        const s = await this.sprintRepository.findOne({
            where: { sprint_id: sprintId },
        });


        if (!s) throw new Error("Sprint not found");

        const project = await this.projectRepository.findOne({
            where: { project_id: s.project_id },
        });


        if (!project) throw new Error("Project not found for sprint");

        const startDate = new Date(s.start_date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(s.end_date);
        endDate.setHours(23, 59, 59, 999); // kraj dana

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const sprintDuration =
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

        const tasksFromSprint = await this.taskRepository.find({ where: { sprint_id: sprintId } });

        // Ako Task ne zna za project_id, filtriraj po sprintu koji već znamo da je za dati project:
        const tasks = tasksFromSprint.filter(t => t.sprint_id === s.sprint_id);

        const finishedTasks = tasks
            .filter(t => t.finished_at) // ima finished_at
            .map(t => ({ ...t, finished_at_date: new Date(t.finished_at!) }))
            .filter(t => t.finished_at_date >= startDate && t.finished_at_date <= endDate && t.finished_at_date <= today)
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
        const proj = await this.projectRepository.findOne({
            where: { project_id: projectId },
        });

        if (!proj) throw new Error("Project not found");

        // fetch sprints koje su završene do danas, po projectId
        const sprints = await this.sprintRepository.find({
            where: { project_id: projectId, end_date: LessThan(new Date()) },
        });

        if (sprints.length === 0) return 0;

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
        const startDateStr = new Date(
            new Date().setDate(new Date().getDate() - 29)
        ).toISOString().slice(0, 10);

        const projects = await this.projectRepository.find({
            where: {
                start_date: MoreThanOrEqual(startDateStr),
            },
        });

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

        const projectUsers = await this.projectUserRepository.find({
            where: {
                added_at: MoreThanOrEqual(startDate),
            },
        });

        const map = buildLast30DaysMap();

        for (const pu of projectUsers) {
            const key = pu.added_at.toISOString().slice(0, 10);

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