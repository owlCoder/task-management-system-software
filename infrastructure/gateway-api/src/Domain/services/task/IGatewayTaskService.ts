import { CommentDTO } from "../../DTOs/task/CommentDTO";
import { CreateCommentDTO } from "../../DTOs/task/CreateCommentDTO";
import { CreateTaskDTO } from "../../DTOs/task/CreateTaskDTO";
import { TaskDTO } from "../../DTOs/task/TaskDTO";
import { Result } from "../../types/common/Result";

export interface IGatewayTaskService {
    getTaskById(taskId: number): Promise<Result<TaskDTO>>;
    getTasksBySprintId(sprintId: number) : Promise<Result<TaskDTO[]>>;
    addTaskBySprintId(sprintId: number, data: CreateTaskDTO): Promise<Result<TaskDTO>>;
    addCommentByTaskId(taskId: number, data: CreateCommentDTO): Promise<Result<CommentDTO>>;
}