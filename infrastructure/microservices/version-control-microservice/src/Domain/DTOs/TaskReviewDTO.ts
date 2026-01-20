import { ReviewStatus } from "../enums/ReviewStatus";

export interface TaskReviewDTO {
  reviewId: number;
  taskId: number;
  authorId: number;
  time: string;
  status: ReviewStatus;
  reviewedBy?: number;
  reviewedAt?: string;
  commentId?: number;
}