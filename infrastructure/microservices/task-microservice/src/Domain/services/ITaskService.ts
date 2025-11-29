import { TaskDTO } from "../DTOs/TaskDTO";
import { TaskResponse } from "../types/TaskResponse";

export interface ITaskService {
    getTaskById(task_id: number): Promise<TaskResponse<TaskDTO>>;

}