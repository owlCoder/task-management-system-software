import { Result } from "../../types/common/Result";
import { ReviewDTO} from "../../DTOs/version-control/ReviewDTO";
import { ReviewCommentDTO } from "../../DTOs/version-control/ReviewCommentDTO";
import { TaskTemplateDTO } from "../../DTOs/version-control/TaskTemplateDTO";
import { CreateTemplateDTO } from "../../DTOs/version-control/CreateTemplateDTO";
import { TaskResponseDTO } from "../../DTOs/version-control/TaskResponseDTO";
import { RejectReviewDTO } from "../../DTOs/version-control/RejectReviewDTO";
import { CreateTaskDTO } from "../../DTOs/version-control/CreateTaskDTO";
import { ReviewsQueryParams } from "../../types/version-control/ReviewsQueryParams";
import { ReviewHistoryItemDTO } from "../../DTOs/version-control/ReviewHistoryItemDTO";

export interface IGatewayVersionControlService {
    sendToReview(taskId: number, senderId: number, senderRole: string): Promise<Result<ReviewDTO>>;
    acceptReview(taskId: number, senderId: number, senderRole: string): Promise<Result<ReviewDTO>>;
    rejectReview(taskId: number, data: RejectReviewDTO, senderId: number, senderRole: string): Promise<Result<ReviewCommentDTO>>;
    getReviews(senderRole: string, params: ReviewsQueryParams): Promise<Result<ReviewDTO[]>>;
    getReviewHistory(taskId: number, senderRole: string): Promise<Result<ReviewHistoryItemDTO[]>>;
    getReviewComment(commentId: number, senderRole: string): Promise<Result<ReviewCommentDTO>>;
    getTemplateById(templateId: number): Promise<Result<TaskTemplateDTO>>;
    getAllTemplates(): Promise<Result<TaskTemplateDTO[]>>;
    createTemplate(data: CreateTemplateDTO, senderId: number): Promise<Result<TaskTemplateDTO>>;
    createTaskFromTemplate(templateId: number, data: CreateTaskDTO, senderId: number): Promise<Result<TaskResponseDTO>>;
    addDependency(templateId: number, dependsOnId: number, senderId: number): Promise<Result<void>>;
}
