import { Task } from "../models/Task";
import { Result } from "../types/Result";

export interface ITaskService {
    getTaskById(task_id: number): Promise<Result<Task>>;
    getAllTasksForSprint(sprint_id: number) : Promise<Result<Task[]>>;
    getAllDummyTasksForSprint() : Promise<Result<Task[]>>;
    addTaskForSprint(
        sprint_id: number,
        worker_id: number,
        project_manager_id : number, 
        title: string, 
        task_description: string, 
        estimated_cost: number
    ): Promise<Result<Task>>;

}