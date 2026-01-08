import { Comment } from "../../Domain/models/Comment";
import { CommentDTO } from "../../Domain/DTOs/CommentDTO";

export function commentToCommentDTO(comment: Comment, task_id: number): CommentDTO {
    return {
        comment_id: comment.comment_id,
        user_id: comment.user_id,
        comment: comment.comment,
        created_at: comment.created_at,
        task_id: task_id
    };
}
