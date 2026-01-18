import { Task } from "../models/Task";
import { TaskVersionDTO } from "../DTOs/TaskVersionDTO";

export interface ITaskVersionService {
  createVersionSnapshot(task: Task): Promise<TaskVersionDTO>;
  getVersionsForTask(task_id: number): Promise<TaskVersionDTO[]>;
  getVersionById(version_id: number): Promise<TaskVersionDTO>;
}