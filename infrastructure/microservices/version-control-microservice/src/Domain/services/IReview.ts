import { TaskReviewDTO } from "../DTOs/TaskReviewDTO";
import { ReviewCommenntDTO } from "../DTOs/ReviewCommentDTO";

export interface IReviewService {
  getTaskForReview() : Promise<TaskReviewDTO[]>;  
  sendToReview(taskId : number) : Promise<void>;
  approveReview(taskId : number) : Promise<ReviewCommenntDTO>;
  rejectReview(taskId : number ,rejectComment : string) : Promise<void>;
 
}
