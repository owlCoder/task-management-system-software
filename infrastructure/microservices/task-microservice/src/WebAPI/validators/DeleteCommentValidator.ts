import { ValidationError } from "./ValidationError";

export class DeleteCommentValidator {
    static validateCommentId(commentId: any): ValidationError {
        if (typeof commentId !== "number" || isNaN(commentId)) {
            return {
                isValid: false,
                message: "Invalid comment ID"
            };
        }

        if (commentId <= 0) {
            return {
                isValid: false,
                message: "Comment ID must be a positive number"
            };
        }

        return { isValid: true };
    }
}
