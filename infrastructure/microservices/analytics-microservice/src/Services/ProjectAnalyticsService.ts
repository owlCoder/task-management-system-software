import { LessThan, Repository } from "typeorm";
import { IProjectAnalyticsService } from "../Domain/services/IProjectAnalyticsService";
import { Task } from "../Domain/models/Task";
import { Sprint } from "../Domain/models/Sprint";
import { Project } from "../Domain/models/Project";
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
        console.log("Entering getBurnDownChartsForSprintId with sprintId:", sprintId);

        console.log("Sprint count:", await this.sprintRepository.count());
        console.log("First sprint:", await this.sprintRepository.find({ take: 1 }));
        const s = await this.sprintRepository.findOne({
            where: { sprint_id: sprintId },
        });
        console.log("prosao fetch");
        if (!s) throw new Error("Sprint not found");

        console.log("postoji sprint");

        const project = await this.projectRepository.findOne({
            where: { project_id: s.project_id },
        });

        console.log("prosao fetch na project");

        if (!project) throw new Error("Project not found for sprint");

        console.log("postoji project");

        const startDate = new Date(s.start_date);
        const endDate = new Date(s.end_date);

        const time = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

        console.log("time calculated:", time);

        const tasks = await this.taskRepository.find({ where: { sprint_id: sprintId } });
        console.log("prosao fetch na tasks");
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
                ideal_progress: ideal,
                real_progress: real
            });
        }
        console.log(project.project_id, s.sprint_id);

        BurndownTasks.map(t => console.log(t));

        return { project_id: project.project_id, sprint_id: s.sprint_id, tasks: BurndownTasks };
    }

    async getBurnUpChartsForSprintId(sprintId: number): Promise<BurnupDto> {
        const s = await this.sprintRepository.findOne({
            where: { sprint_id: sprintId },
        });
        console.log("prosao fetch");
        if (!s) throw new Error("Sprint not found");

        const project = await this.projectRepository.findOne({
            where: { project_id: s.project_id },
        });
        console.log("prosao fetch na project");
        if (!project) throw new Error("Project not found for sprint");

        const startDate = new Date(s.start_date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(s.end_date);
        endDate.setHours(23, 59, 59, 999); // kraj dana

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const sprintDuration =
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

        const tasks = await this.taskRepository.find({ where: { sprint_id: sprintId } });
        console.log("prosao fetch na tasks");
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
                y: cumulativeWork,
            });
        }

        return {
            project_id: project.project_id,
            sprint_id: s.sprint_id,
            sprint_duration_date: sprintDuration,
            work_amount: totalWork,
            points,
        };
    }


    async getVelocityForProject(projectId: number): Promise<number> {

        const proj = await this.projectRepository.findOne({
            where: { project_id: projectId },
        });

        if (!proj) throw new Error("Project not found for sprint");
        const sprints = await this.sprintRepository.find({ where: { project: proj, end_date: LessThan(new Date()) } });

        if (sprints.length === 0)
            return 0;

        let sum = 0;

        for (let i = 0; i < sprints.length; ++i)
            sum += sprints[i].end_date.getTime() - sprints[i].start_date.getTime();


        const avgHours = (sum / sprints.length) / (1000 * 60 * 60);

        return parseFloat(avgHours.toFixed(2));
    }



}       