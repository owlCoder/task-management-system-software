export interface ReviewCommentDTO {
  commentId: number;
  reviewId: number;
  taskId: number;
  authorId: number;
  commentText: string;
  time: string;
}
