import { TaskDTO } from "../../models/task/TaskDTO";
import { CreateTaskDTO } from "../../models/task/CreateTaskDTO";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";

export interface ITaskAPI {
  getTasksByProject(projectId: string): Promise<TaskDTO[]>;
  getTask(taskId: string): Promise<TaskDTO>;
  createTask(payload: CreateTaskDTO): Promise<TaskDTO>;
  updateTask(taskId: string, payload: UpdateTaskDTO): Promise<TaskDTO>;
  deleteTask(taskId: string): Promise<void>;
  uploadFile(taskId: string, file : File) : Promise<void>;
}
