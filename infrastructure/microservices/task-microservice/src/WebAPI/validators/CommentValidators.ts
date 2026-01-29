import { CreateCommentDTO } from "../../Domain/DTOs/CreateCommentDTO";
import { ValidationError } from "./ValidationError";

export function validateCommentId(commentId: number): ValidationError {
    if (typeof commentId !== "number" || isNaN(commentId)){
        return { isValid: false, message: "Invalid comment ID" };
    }

    if (commentId <= 0) {
        return { isValid: false, message: "Comment ID must be a positive number" };
    }

    return { isValid: true };
}

export function validateCreateComment(commentDTO: CreateCommentDTO): ValidationError {
    if(typeof commentDTO.comment !== "string" || commentDTO.comment.trim().length === 0){
        return { isValid: false, message: "Comment must be a non-empty string" };
    }

    return { isValid: true };
}