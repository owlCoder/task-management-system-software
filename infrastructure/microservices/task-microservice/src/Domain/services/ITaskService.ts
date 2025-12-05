import { TaskDTO } from "../DTOs/TaskDTO";
import { TaskResponse } from "../types/TaskResponse";
import { CommentDTO } from "../DTOs/CommentDTO";

export interface ITaskService {
    getTaskById(task_id: number): Promise<TaskResponse<TaskDTO>>;
    getAllTasksForProject(project_id: number) : Promise<TaskResponse<TaskDTO[]>>;
    getAllDummyTasksForProject() : Promise<TaskResponse<TaskDTO[]>>;
    addTaskForProject(project_id: number, worker_id: number, project_manager_id : number, title: string, task_description: string, estimated_cost: number): Promise<TaskResponse<TaskDTO>>;

}