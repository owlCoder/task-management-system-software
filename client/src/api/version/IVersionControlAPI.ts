import { TaskReviewDTO } from "../../models/version/TaskReviewDTO";
import { ReviewCommentDTO } from "../../models/version/ReviewCommentDTO";

export interface IVersionControlAPI {
  getTasksInReview(): Promise<TaskReviewDTO[]>;

  sendTaskToReview(taskId: number): Promise<TaskReviewDTO>;

  approveTaskReview(taskId: number): Promise<TaskReviewDTO>;

  rejectTaskReview(taskId: number, commentText: string): Promise<ReviewCommentDTO>;

  getReviewHistoryByTaskId(taskId: number): Promise<(TaskReviewDTO | ReviewCommentDTO)[]>;
}
