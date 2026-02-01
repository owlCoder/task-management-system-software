import { ReviewCommenntDTO } from "../Domain/DTOs/ReviewCommentDTO";
import { TaskReviewDTO } from "../Domain/DTOs/TaskReviewDTO";
import { Review } from "../Domain/models/Review";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { IReviewService } from "../Domain/services/IReview";
import { ReviewComment } from "../Domain/models/ReviewComment";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { Result } from "../Domain/types/Result";
import { ReviewStatus } from "../Domain/enums/ReviewStatus";
import { toReviewDTO } from "../Helpers/Converter/toReviewDTO";
import { ReviewHistoryItemDTO } from "../Domain/DTOs/ReviewHistoryItemDTO";
import { IUserServiceClient } from "../Domain/services/external-services/IUserServiceClient";
import { INotifyService } from "../Domain/services/INotifyService";
import { NotificationType } from "../Domain/enums/NotificationType";


export class  ReviewService implements IReviewService {

    constructor(
        private reviewRepository: Repository<Review>,
        private reviewCommentRepository: Repository<ReviewComment>,
        private userServiceClient: IUserServiceClient,
        private readonly notifyService: INotifyService
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

    async getReviewHistory(taskId: number): Promise<Result<ReviewHistoryItemDTO[]>> {
        const reviews = await this.reviewRepository.find({
            where: { taskId },
            order: { reviewId: "DESC" },
        });

        if (!reviews.length) {
            return { success: true, data: [] };
        }

        const commentIds = reviews
            .map((r) => Number(r.commentId ?? 0))
            .filter((id) => Number.isFinite(id) && id > 0);

        const uniqueCommentIds = Array.from(new Set(commentIds));

        const comments = uniqueCommentIds.length
            ? await this.reviewCommentRepository.find({ where: { commentId: In(uniqueCommentIds) } })
            : [];

        const commentMap = new Map<number, string>();
        for (const c of comments) {
            commentMap.set(c.commentId, c.commentText);
        }

        const authorIds = Array.from(
            new Set(
                reviews
                    .map((r) => Number(r.authorId))
                    .filter((id) => Number.isFinite(id) && id > 0)
            )
        );

        const authorResult = await this.userServiceClient.getUsersByIds(authorIds);
        const authorMap = new Map<number, string>();
        if (authorResult.success) {
            for (const u of authorResult.data) {
                const id = Number(u.user_id ?? u.user_id);
                const name = u.username ?? u.username;
                if (Number.isFinite(id) && name) {
                    authorMap.set(id, name);
                }
            }
        }

        const data: ReviewHistoryItemDTO[] = reviews.map((r) => ({
            review: toReviewDTO(r),
            commentText: r.commentId ? commentMap.get(r.commentId) : undefined,
            authorName: authorMap.get(r.authorId),
        }));

        return { success: true, data };
    }

    async sendToReview(taskId: number, authorId: number): Promise<Result<TaskReviewDTO>> {
    const existingReview = await this.reviewRepository.findOne({
        where: { taskId },
        order: { reviewId: "DESC" },
    });

    if (!existingReview) {
        const newReview = await this.createReview(taskId, authorId);
        return { success: true, data: toReviewDTO(newReview) };
    }

    switch (existingReview.status) {
        case ReviewStatus.REVIEW:
            return {
                success: false,
                code: ErrorCode.CONFLICT,
                error: "Task is already in review"
            };

        case ReviewStatus.APPROVED:
            return {
                success: false,
                code: ErrorCode.CONFLICT,
                error: "Task is already approved"
            };

        case ReviewStatus.REJECTED:
            const newReview = await this.createReview(taskId, authorId);
            return { success: true, data: toReviewDTO(newReview) };

        default:
            return {
                success: false,
                code: ErrorCode.INTERNAL_ERROR,
                error: "Unknown review status"
            };
        }
    }

    async createReview(taskId: number, authorId: number): Promise<Review> {
        const newReview = this.reviewRepository.create({
        taskId,
        authorId,
        status: ReviewStatus.REVIEW,
        time: new Date().toISOString(),
        reviewedBy: null,
        reviewedAt: null,
        commentId: null,
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

        if (review.authorId) {
            this.notifyService.sendNotification(
                [review.authorId],
                "Review approved",
                `Your task review for task #${taskId} has been approved.`,
                NotificationType.INFO
            );
        }

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

        if (review.authorId) {
            this.notifyService.sendNotification(
                [review.authorId],
                "Review rejected",
                `Your task review for task #${taskId} has been rejected.`,
                NotificationType.WARNING
            );
        }

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
