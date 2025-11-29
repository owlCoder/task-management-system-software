import { Repository } from "typeorm";
import { TaskDTO } from "../Domain/DTOs/TaskDTO";
import { ITaskService } from "../Domain/services/ITaskService";
import { Task } from "../Domain/models/Task";   
import { TaskResponse } from "../Domain/types/TaskResponse";

export class TaskService implements ITaskService {

    constructor(private readonly taskRepository: Repository<Task>) {}

    async getTaskById(task_id: number): Promise<TaskResponse<TaskDTO>> {
        const task = await this.taskRepository.findOne({ where: { task_id } });
        if(!task ) {
            return {
                success: false,
                statusCode: 404,
                message: `Task with id ${task_id} not found`
            };
        }
       return {success: true, data: task, statusCode: 200};
    }
}

