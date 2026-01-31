import { Task } from "../models/Task";
import { TaskVersionDTO } from "../DTOs/TaskVersionDTO";
import { Result } from "../types/Result";

export interface ITaskVersionService {
  createVersionSnapshot(task: Task): Promise<Result<TaskVersionDTO>>;
  getVersionsForTask(task_id: number): Promise<Result<TaskVersionDTO[]>>;
  getVersionById(version_id: number): Promise<Result<TaskVersionDTO>>;
}