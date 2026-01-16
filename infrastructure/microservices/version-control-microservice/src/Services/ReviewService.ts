import { ReviewCommenntDTO } from "../Domain/DTOs/ReviewCommentDTO";
import { TaskReviewDTO } from "../Domain/DTOs/TaskReviewDTO";
import { Review } from "../Domain/models/Review";
import { In, Not, Repository } from "typeorm";
import { IReviewService } from "../Domain/services/IReview";
import { ReviewComment } from "../Domain/models/ReviewComment";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { Result } from "../Domain/types/Result";
import bcrypt from "bcryptjs";
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

   async sendToReview(taskId: number): Promise<Result<TaskReviewDTO>> {
        let review = await this.reviewRepository.findOne({
            where: { taskId },
        });

        if (!review) {
            review = await this.createReview(taskId);
        } 
        else {
            review.status = ReviewStatus.REVIEW;
            await this.reviewRepository.save(review);
        }

        return { success: true, data: toReviewDTO(review) };
}

    async createReview(taskId: number): Promise<Review> {
        const newReview = this.reviewRepository.create({
            taskId: taskId,
            authorId: 0,
            status: ReviewStatus.REVIEW,
            time: new Date().toISOString(),
        });

        return await this.reviewRepository.save(newReview);
    }


    async approveReview(taskId: number): Promise<Result<TaskReviewDTO>> {
        const review = await this.reviewRepository.findOne({
            where: { taskId },
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
        await this.reviewRepository.save(review);

        return { success: true, data: toReviewDTO(review) };
    }

    async rejectReview(taskId: number,rejectComment: string): Promise<Result<ReviewCommenntDTO>> {

        const review = await this.reviewRepository.findOne({
            where: { taskId },
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
            taskId,
            authorId: 0,
            commentText: rejectComment,
            time: new Date().toISOString(),
        });

        review.status = ReviewStatus.REJECTED;
        review.commentId = newComment.taskId;

        await this.reviewRepository.save(review);

        return {success: true,data: {taskId,commentId : newComment.commentId,
            authorId: newComment.authorId,
            commentText: newComment.commentText,
            time: newComment.time,
        },
    };
}

}