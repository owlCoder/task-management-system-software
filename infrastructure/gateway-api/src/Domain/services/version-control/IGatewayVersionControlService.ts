import { Result } from "../../types/common/Result";
import { ReviewDTO} from "../../DTOs/version-control/ReviewDTO";
import { ReviewCommentDTO } from "../../DTOs/version-control/ReviewCommentDTO";

export interface IGatewayVersionControlService {
    sendToReview(taskId : number,authorId : number) : Promise<Result<ReviewDTO>>;
    acceptReview(taskId : number,reviewedBy : number) : Promise<Result<ReviewDTO>>;
    rejectReview(taskId : number,reviewedBy : number,rejectComment : string) : Promise<Result<ReviewCommentDTO>>;
    getReviews() : Promise<Result<ReviewDTO[]>>;
}