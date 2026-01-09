import { Result } from "../types/Result";
import { Comment } from "../models/Comment";
import { CreateCommentDTO } from "../DTOs/CreateCommentDTO";

export interface ICommentService{
    addComment(task_id: number, createCommentDTO: CreateCommentDTO,user_id: number): Promise<Result<Comment>>;
    deleteComment(comment_id: number,user_id: number): Promise<Result<boolean>>;
}