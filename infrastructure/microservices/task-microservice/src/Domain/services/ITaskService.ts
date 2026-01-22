import { Task } from "../models/Task";
import { Result } from "../types/Result";
import { CreateTaskDTO } from "../DTOs/CreateTaskDTO";
import { UpdateTaskDTO } from "../DTOs/UpdateTaskDTO";
import { TaskStatus } from "../enums/TaskStatus";

export interface ITaskService {
    getTaskById(task_id: number,user_id: number): Promise<Result<Task>>;
    getAllTasksForSprint(sprint_id: number,user_id: number) : Promise<Result<Task[]>>;
    getAllDummyTasksForSprint() : Promise<Result<Task[]>>;
    addTaskForSprint(
        sprint_id: number,
        createTaskDTO: CreateTaskDTO,
        user_id: number
    ): Promise<Result<Task>>;
    updateTask(task_id: number, updateTaskDTO: UpdateTaskDTO,user_id: number): Promise<Result<Task>>;
    deleteTask(task_id: number,user_id: number): Promise<Result<boolean>>;
    updateTaskStatus(task_id: number, newStatus: TaskStatus, user_id: number,file_id? : number): Promise<Result<Task>>
}