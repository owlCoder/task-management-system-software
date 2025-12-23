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

        const time = (s.end_date.getTime() - s.start_date.getTime()) / (1000 * 60 * 60); //allowed hours to spend in sprint

        //NEED TO CHANGE FROM PROJECT TO SPRINT ID IN TASK! - sastanak sa mandicem i goranom je u sredu!
        const tasks = await this.taskRepository.find({ where: { project_id: sprintId } });

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
        const s = await this.sprintRepository.findOneBy({ sprint_id: sprintId });

        const time = (s.end_date.getTime() - s.start_date.getTime()) / (1000 * 60 * 60 * 24); //x-axis in days

        //NEED TO CHANGE FROM PROJECT TO SPRINT ID IN TASK! - sastanak sa mandicem i goranom je u sredu!
        const tasks = await this.taskRepository.find({ where: { project_id: sprintId } });

        let sum = 0; //y - axis

        for (let i = 0; i < tasks.length; ++i)
            sum += tasks[i].estimated_cost;


        const points: BurnupPointDto[] = [];

        for (const task of tasks) {
            //TODO dodati kada je task zavrsen da bi mogao da se stavi na grafik

            // if (
            //     task.finished_at &&
            //     task.finished_at <= sprint.end_date &&
            //     task.finished_at > today
            // ) {
            //     points.push({
            //         x: task.total_hours_spent,
            //         y: task.estimated_cost,
            //     });
            // }
        }

        return { project_id: s.project.project_id, sprint_id: s.sprint_id, sprint_duration_date: time, work_amount: sum, points: points };
    }


    async getVelocityForProject(projectId: number): Promise<number> {
        const proj = await this.projectRepository.find({ where: { project_id: projectId } })[0];
        const sprints = await this.sprintRepository.find({ where: { project: proj, end_date: LessThan(new Date()) } });

        let sum = 0;

        for (let i = 0; i < sprints.length; ++i)
            sum += sprints[i].end_date.getTime() - sprints[i].start_date.getTime();


        const avgHours = (sum / sprints.length) / (1000 * 60 * 60);

        return parseFloat(avgHours.toFixed(2));
    }



}       