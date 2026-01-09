import { CommentDTO } from "../../DTOs/task/CommentDTO";
import { CreateCommentDTO } from "../../DTOs/task/CreateCommentDTO";
import { CreateTaskDTO } from "../../DTOs/task/CreateTaskDTO";
import { TaskDTO } from "../../DTOs/task/TaskDTO";
import { UpdateTaskDTO } from "../../DTOs/task/UpdateTaskDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayTaskService {
    getTaskById(taskId: number, senderId: number): Promise<Result<TaskDTO>>;
    getTasksBySprintId(sprintId: number, senderId: number) : Promise<Result<TaskDTO[]>>;
    addTaskBySprintId(sprintId: number, data: CreateTaskDTO, senderId: number): Promise<Result<TaskDTO>>;
    updateTaskById(taskId: number, data: UpdateTaskDTO, senderId: number): Promise<Result<TaskDTO>>;
    deleteTaskById(taskId: number, senderId: number): Promise<Result<void>>;
    addCommentByTaskId(taskId: number, data: CreateCommentDTO, senderId: number): Promise<Result<CommentDTO>>;
    deleteCommentById(commentId: number, senderId: number): Promise<Result<void>>;
}