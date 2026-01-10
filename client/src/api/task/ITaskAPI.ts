import { TaskDTO } from "../../models/task/TaskDTO";
import { CreateTaskDTO } from "../../models/task/CreateTaskDTO";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";
import { CommentDTO } from "../../models/task/CommentDTO";

export interface ITaskAPI {
  getTasksByProject(projectId: string): Promise<TaskDTO[]>;
  getTask(taskId: number): Promise<TaskDTO>;
  createTask(payload: CreateTaskDTO): Promise<TaskDTO>;
  updateTask(taskId: number, payload: UpdateTaskDTO): Promise<TaskDTO>;
  deleteTask(taskId: string): Promise<void>;
  uploadComment(taskId:number,userId:number,comment:string) : Promise<CommentDTO>;
  deleteComment(commentId:number,userId:number) : Promise<void>;
}
