import { ReviewStatus} from "../../enums/version-control/ReviewStatus";

export interface ReviewDTO {
    reviewId: number;
    taskId: number;
    authorId: number;
    status: ReviewStatus;
    time: string;
    reviewedBy?: number;
    reviewedAt?: string;
    commentId?: number;
}