import { CommentDTO } from "../../DTOs/task/CommentDTO";
import { CreateCommentDTO } from "../../DTOs/task/CreateCommentDTO";
import { CreateTaskDTO } from "../../DTOs/task/CreateTaskDTO";
import { TaskDTO } from "../../DTOs/task/TaskDTO";
import { UpdateTaskDTO } from "../../DTOs/task/UpdateTaskDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayTaskService {
    getTaskById(taskId: number): Promise<Result<TaskDTO>>;
    getTasksBySprintId(sprintId: number) : Promise<Result<TaskDTO[]>>;
    addTaskBySprintId(sprintId: number, data: CreateTaskDTO): Promise<Result<TaskDTO>>;
    updateTaskById(taskId: number, data: UpdateTaskDTO): Promise<Result<TaskDTO>>;
    deleteTaskById(taskId: number): Promise<Result<void>>;
    addCommentByTaskId(taskId: number, data: CreateCommentDTO): Promise<Result<CommentDTO>>;
    deleteCommentById(commentId: number): Promise<Result<void>>;
}