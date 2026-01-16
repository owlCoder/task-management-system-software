import { Review } from "../../Domain/models/Review";
import { TaskReviewDTO } from "../../Domain/DTOs/TaskReviewDTO";

export function toReviewDTO(review: Review): TaskReviewDTO {
  return {
    taskId : review.taskId,
    authorId : review.authorId,
    status : review.status, 
    time : review.time,
    };
}
