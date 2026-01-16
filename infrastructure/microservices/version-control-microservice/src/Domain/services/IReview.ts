import { TaskReviewDTO } from "../DTOs/TaskReviewDTO";
import { ReviewCommenntDTO } from "../DTOs/ReviewCommentDTO";
import { Result } from "../types/Result";

export interface IReviewService {
  getTaskForReview() : Promise<Result<TaskReviewDTO[]>>;  
  sendToReview(taskId : number) : Promise<Result<TaskReviewDTO>>;
  approveReview(taskId : number) : Promise<Result<TaskReviewDTO>>;
  rejectReview(taskId : number ,rejectComment : string) : Promise<Result<ReviewCommenntDTO>>;
}
