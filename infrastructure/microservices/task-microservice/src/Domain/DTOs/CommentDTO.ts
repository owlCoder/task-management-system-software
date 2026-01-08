export interface CommentDTO {
    comment_id: number;
    user_id: number;
    comment: string;
    created_at: Date;
    task_id: number;
}
