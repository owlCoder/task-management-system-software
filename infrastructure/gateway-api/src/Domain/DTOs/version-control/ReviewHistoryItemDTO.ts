import { ReviewDTO } from "./ReviewDTO";

export interface ReviewHistoryItemDTO {
  review: ReviewDTO;
  commentText?: string;
  authorName?: string;
}
