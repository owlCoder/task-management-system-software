import { Repository } from "typeorm";
import { TaskDTO } from "../Domain/DTOs/TaskDTO";
import { ITaskService } from "../Domain/services/ITaskService";
import { Task } from "../Domain/models/Task";   
import { TaskResponse } from "../Domain/types/TaskResponse";
import { TaskStatus } from "../Domain/enums/task_status";

export class TaskService implements ITaskService {

    constructor(private readonly taskRepository: Repository<Task>) {}

    private readonly dummyTasks: TaskDTO[] = [
    {
        task_id: 1,
        project_id: 100,
        title: "Dummy task 1",
        task_description: "Opis dummy taska 1",
        task_status:   TaskStatus.IN_PROGRESS
    },
    {
        task_id: 2,
        project_id: 100,
        title: "Dummy task 2",
        task_description: "Opis dummy taska 2",
        task_status: TaskStatus.IN_PROGRESS
    }
];
    async getAllTasksForProject(project_id: number) : Promise<TaskResponse<TaskDTO[]>>{
        try{
            const tasks = await this.taskRepository.find({ where: { project_id } });
            const result: TaskDTO[] = tasks.map(t => this.taskToDTO(t));
            if(tasks.length === 0) {
                //Vracamo dummy podatke ako nema zadataka u bazi dok smo u developmentu
                return {
                    success: true,
                    statusCode: 200,
                    data: this.dummyTasks.filter(t => t.project_id === 1)
                };
            }
            return {success: true, data: result, statusCode: 200};
    }catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: "Internal server error"
            };
        }
    }

    async getTaskById(task_id: number): Promise<TaskResponse<TaskDTO>> {
        try{
            const task = await this.taskRepository.findOne({ where: { task_id } });
            if(!task ) {
                return {
                    success: false,
                    statusCode: 404,
                    message: `Task with id ${task_id} not found`
                };
            }
                    const result: TaskDTO = this.taskToDTO(task);
            return {success: true, data: result, statusCode: 200};
    }
    catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: "Internal server error"
            };
        }
    }
    taskToDTO(task: Task): TaskDTO {
        return {
            task_id: task.task_id,
            project_id: task.project_id,
            title: task.title,
            task_description: task.task_description,
            task_status: task.task_status,
            attachment_file_uuid: task.attachment_file_uuid,
            estimated_cost: task.estimated_cost,
            total_hours_spent: task.total_hours_spent
        };
    }

}

