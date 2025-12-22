import { LessThan, Repository } from "typeorm";
import { IAnalyticsService } from "../Domain/services/IAnalyticsService";
import { Task } from "../../../task-microservice/src/Domain/models/Task";
import { Sprint } from "../../../project-microservice/src/Domain/models/Sprint";
import { Project } from "../../../project-microservice/src/Domain/models/Project";
import { BurndownDto } from "../Domain/DTOs/BurndownDto";
import { BurndownTaskDTO } from "../Domain/DTOs/BurndownTaskDto";
import { takeCoverage } from "v8";

export class AnalyticsService implements IAnalyticsService {

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




}