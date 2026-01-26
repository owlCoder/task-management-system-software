import { ReviewCommenntDTO } from "../Domain/DTOs/ReviewCommentDTO";
import { TaskReviewDTO } from "../Domain/DTOs/TaskReviewDTO";
import { Review } from "../Domain/models/Review";
import { FindOptionsWhere, Repository } from "typeorm";
import { IReviewService } from "../Domain/services/IReview";
import { ReviewComment } from "../Domain/models/ReviewComment";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { Result } from "../Domain/types/Result";
import { ReviewStatus } from "../Domain/enums/ReviewStatus";
import { toReviewDTO } from "../Helpers/Converter/toReviewDTO";


export class  ReviewService implements IReviewService {

    constructor(
        private reviewRepository: Repository<Review>,
        private reviewCommentRepository: Repository<ReviewComment>
    ) {}

    async getTaskForReview(): Promise<Result<TaskReviewDTO[]>> {
        const reviews = await this.reviewRepository.find({
        where: { status: ReviewStatus.REVIEW }
        });

        return {success: true,data: reviews.map((r) => toReviewDTO(r))
        };
    }

    async getReviews(status?: ReviewStatus): Promise<Result<TaskReviewDTO[]>> {
        const where: FindOptionsWhere<Review> | undefined =
            status !== undefined ? { status } : undefined;

        const reviews = await this.reviewRepository.find({
        where,
        order: { reviewId: "DESC" },
        });

        return { success: true, data: reviews.map((r) => toReviewDTO(r)) };
    }

    async getCommentById(commentId: number): Promise<Result<ReviewCommenntDTO>> {
        const c = await this.reviewCommentRepository.findOne({ where: { commentId } });
        if (!c) {
        return { success: false, code: ErrorCode.NOT_FOUND, error: `Comment ${commentId} not found` };
        }
        return {
        success: true,
        data: {
            commentId: c.commentId,
            reviewId: c.reviewId,
            taskId: c.taskId,
            authorId: c.authorId,
            commentText: c.commentText,
            time: c.time,
        },
        };
    }

    async sendToReview(taskId: number, authorId: number): Promise<Result<TaskReviewDTO>> {
        const review = await this.createReview(taskId, authorId);

        return { success: true, data: toReviewDTO(review) };
    }

    async createReview(taskId: number,authorId : number): Promise<Review> {
        const newReview = this.reviewRepository.create({
            taskId: taskId,
            authorId: authorId,
            status: ReviewStatus.REVIEW,
            time: new Date().toISOString(),
            reviewedBy: undefined,
            reviewedAt: undefined,
            commentId: undefined,
        });

        return await this.reviewRepository.save(newReview);
    }


    async approveReview(taskId: number,reviewedBy : number): Promise<Result<TaskReviewDTO>> {
        const review = await this.reviewRepository.findOne({
            where: { taskId, status: ReviewStatus.REVIEW },
            order: { reviewId: "DESC" },
        });

        if (!review) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Task with ID ${taskId} not found`,
            };
        }

        if (review.status !== ReviewStatus.REVIEW) {
            return {
                success: false,
                code: ErrorCode.FORBIDDEN,
                error: `Task is not in REVIEW status`,
            };
        }

        review.status = ReviewStatus.APPROVED;
        review.reviewedBy = reviewedBy;
        review.reviewedAt = new Date().toISOString();
        await this.reviewRepository.save(review);

        return { success: true, data: toReviewDTO(review) };
    }

    async rejectReview(taskId: number,reviewedBy : number,rejectComment: string): Promise<Result<ReviewCommenntDTO>> {

        const review = await this.reviewRepository.findOne({
            where: { taskId, status: ReviewStatus.REVIEW },
            order: { reviewId: "DESC" },
        });

        if (!review) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Task with ID ${taskId} not found`,
            };
        }

        if (review.status !== ReviewStatus.REVIEW) {
            return {
                success: false,
                code: ErrorCode.FORBIDDEN,
                error: `Task is not in REVIEW status`,
            };
        }

        if (!rejectComment.trim()) {
            return {
                success: false,
                code: ErrorCode.INVALID_INPUT,
                error: `Rejection comment is required`,
            };
        }

        const newComment = await this.reviewCommentRepository.save({
            reviewId: review.reviewId,
            taskId,
            authorId: reviewedBy,
            commentText: rejectComment,
            time: new Date().toISOString(),
        });

        review.status = ReviewStatus.REJECTED;
        review.commentId = newComment.commentId;
        review.reviewedBy = reviewedBy; 
        review.reviewedAt = new Date().toISOString();

        await this.reviewRepository.save(review);

        return {success: true,data: 
            { 
            commentId: newComment.commentId,
            reviewId: newComment.reviewId, 
            taskId,
            authorId: newComment.authorId,
            commentText: newComment.commentText,
            time: newComment.time,
        },
    };
}

}
