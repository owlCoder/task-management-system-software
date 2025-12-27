export interface CommentDTO {
    comment_id: number;
    user_id: number;
    task_id: number;
    comment: string;
    created_at: Date;
}