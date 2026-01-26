import { TaskReviewDTO } from "../DTOs/TaskReviewDTO";
import { ReviewCommenntDTO } from "../DTOs/ReviewCommentDTO";
import { Result } from "../types/Result";
import { ReviewStatus } from "../enums/ReviewStatus";
import { ReviewHistoryItemDTO } from "../DTOs/ReviewHistoryItemDTO";

export interface IReviewService {
  getTaskForReview() : Promise<Result<TaskReviewDTO[]>>;  
  getReviews(status?: ReviewStatus): Promise<Result<TaskReviewDTO[]>>;
  getReviewHistory(taskId: number): Promise<Result<ReviewHistoryItemDTO[]>>;
  getCommentById(commentId: number): Promise<Result<ReviewCommenntDTO>>;
  sendToReview(taskId : number,authorId : number) : Promise<Result<TaskReviewDTO>>;
  approveReview(taskId : number,reviewedBy : number) : Promise<Result<TaskReviewDTO>>;
  rejectReview(taskId : number ,reviewedBy : number,rejectComment : string) : Promise<Result<ReviewCommenntDTO>>;
}
