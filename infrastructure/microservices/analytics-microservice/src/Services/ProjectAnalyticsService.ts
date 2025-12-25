import { LessThan, Repository } from "typeorm";
import { IProjectAnalyticsService } from "../Domain/services/IProjectAnalyticsService";
import { Task } from "../../../task-microservice/src/Domain/models/Task";
import { Sprint } from "../../../project-microservice/src/Domain/models/Sprint";
import { Project } from "../../../project-microservice/src/Domain/models/Project";
import { BurndownDto } from "../Domain/DTOs/BurndownDto";
import { BurndownTaskDTO } from "../Domain/DTOs/BurndownTaskDto";
import { BurnupDto } from "../Domain/DTOs/BurnupDto";
import { BurnupPointDto } from "../Domain/DTOs/BurnupPointDto";


export class ProjectAnalyticsService implements IProjectAnalyticsService {

    constructor(
        private readonly taskRepository: Repository<Task>,
        private readonly sprintRepository: Repository<Sprint>,
        private readonly projectRepository: Repository<Project>,
    ) { }

    async getBurnDownChartsForSprintId(sprintId: number): Promise<BurndownDto> {

        const s = await this.sprintRepository.findOneBy({ sprint_id: sprintId });

        if (!s) {
            throw new Error("Sprint not found");
        }

        const time = (s.end_date.getTime() - s.start_date.getTime()) / (1000 * 60 * 60); //allowed hours to spend in sprint

        const tasks = await this.taskRepository.find({ where: { sprint_id: sprintId } });

        let sum = 0;

        for (let i = 0; i < tasks.length; ++i)
            sum += tasks[i].estimated_cost;

        let BurndownTasks: BurndownTaskDTO[] = [];

        for (let i = 0; i < tasks.length; ++i) {
            let ideal = time * (tasks[i].estimated_cost / sum);
            let real = tasks[i].total_hours_spent;

            BurndownTasks.push({
                task_id: tasks[i].task_id,
                ideal_progress: ideal,
                real_progress: real
            });
        }

        return { project_id: s.project.project_id, sprint_id: s.sprint_id, tasks: BurndownTasks }
    }

    async getBurnUpChartsForSprintId(sprintId: number): Promise<BurnupDto> {
        const sprint = await this.sprintRepository.findOne({
            where: { sprint_id: sprintId }
        });

        if (!sprint) {
            throw new Error("Sprint not found");
        }

        const sprintDuration =
            (sprint.end_date.getTime() - sprint.start_date.getTime()) /
            (1000 * 60 * 60 * 24);

        const tasks = await this.taskRepository.find({
            where: { sprint_id: sprintId },
        });

        const totalWork = tasks.reduce(
            (sum, t) => sum + t.estimated_cost,
            0,
        );

        const today = new Date();

        const finishedTasks = tasks
            .filter(
                t =>
                    t.finished_at &&
                    t.finished_at >= sprint.start_date &&
                    t.finished_at <= sprint.end_date &&
                    t.finished_at <= today,
            )
            .sort(
                (a, b) =>
                    a.finished_at!.getTime() -
                    b.finished_at!.getTime(),
            );

        const points: BurnupPointDto[] = [];
        let cumulativeWork = 0;

        for (const task of finishedTasks) {
            cumulativeWork += task.estimated_cost;

            const dayFromStart =
                (task.finished_at!.getTime() -
                    sprint.start_date.getTime()) /
                (1000 * 60 * 60 * 24);

            points.push({
                x: Math.floor(dayFromStart),
                y: cumulativeWork,
            });
        }

        return {
            project_id: sprint.project.project_id,
            sprint_id: sprint.sprint_id,
            sprint_duration_date: sprintDuration,
            work_amount: totalWork,
            points,
        };
    }


    async getVelocityForProject(projectId: number): Promise<number> {
        const proj = await this.projectRepository.findOneBy({ project_id: projectId });

        if (!proj) {
            throw new Error("Project not found");
        }

        const sprints = await this.sprintRepository.find({ where: { project: proj, end_date: LessThan(new Date()) } });

        let sum = 0;

        for (let i = 0; i < sprints.length; ++i)
            sum += sprints[i].end_date.getTime() - sprints[i].start_date.getTime();


        const avgHours = (sum / sprints.length) / (1000 * 60 * 60);

        return parseFloat(avgHours.toFixed(2));
    }



}       