import { TaskReviewDTO } from "../../models/version/TaskReviewDTO";
import { ReviewCommentDTO } from "../../models/version/ReviewCommentDTO";
import { ReviewHistoryItemDTO } from "../../models/version/ReviewHistoryItemDTO";

export interface IVersionControlAPI {
  getTasksInReview(): Promise<TaskReviewDTO[]>;

  sendTaskToReview(taskId: number): Promise<TaskReviewDTO>;

  approveTaskReview(taskId: number): Promise<TaskReviewDTO>;

  rejectTaskReview(taskId: number, commentText: string): Promise<ReviewCommentDTO>;

  getReviewHistoryByTaskId(taskId: number): Promise<ReviewHistoryItemDTO[]>;

  getReviews(status?: "REVIEW" | "APPROVED" | "REJECTED" | "ALL"): Promise<TaskReviewDTO[]>;
  
  getReviewComment(commentId: number): Promise<ReviewCommentDTO>;
}
