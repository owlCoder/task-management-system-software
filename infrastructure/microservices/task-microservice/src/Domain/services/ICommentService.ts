import { CommentDTO } from "../DTOs/CommentDTO";
import { TaskResponse } from "../types/TaskResponse";

export interface ICommentService{
    addComment(task_id: number, user_id: number, commentText: string): Promise<TaskResponse<CommentDTO>>;
}