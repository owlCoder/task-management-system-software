import { Result } from "../types/Result";
import { Comment } from "../models/Comment";
export interface ICommentService{
    addComment(task_id: number, user_id: number, commentText: string): Promise<Result<Comment>>;
}