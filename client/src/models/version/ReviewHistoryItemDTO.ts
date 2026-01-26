import { TaskReviewDTO } from "./TaskReviewDTO";

export interface ReviewHistoryItemDTO {
  review: TaskReviewDTO;
  commentText?: string;
  authorName?: string;
}
