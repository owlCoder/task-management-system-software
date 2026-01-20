import { TaskDTO } from "../../models/task/TaskDTO";
import { CreateTaskDTO } from "../../models/task/CreateTaskDTO";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";
import { CommentDTO } from "../../models/task/CommentDTO";
import { TaskVersionDTO } from "../../models/task/TaskVersionDTO";

export interface ITaskAPI {
  getTasksByProject(projectId: string): Promise<TaskDTO[]>;
  getTask(taskId: number): Promise<TaskDTO>;
  createTask(payload: CreateTaskDTO): Promise<TaskDTO>;
  updateTask(taskId: number, payload: UpdateTaskDTO): Promise<TaskDTO>;
  updateTaskStatus(taskId: number, status: string,fileId : number): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
  uploadComment(taskId:number,userId:number,comment:string) : Promise<CommentDTO>;
  deleteComment(commentId:number,userId:number) : Promise<void>;
  getTaskVersions(taskId: number): Promise<TaskVersionDTO[]>;
  getTaskVersion(taskId: number, versionId: number): Promise<TaskVersionDTO>;
}
