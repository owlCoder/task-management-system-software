import { ErrorCode } from "../../Domain/enums/ErrorCode";
import { Task } from "../../Domain/models/Task";
import { CommentResponseDTO } from "../../WebAPI/DTOs/Response/CommentResponseDTO";
import { TaskResponseDTO } from "../../WebAPI/DTOs/Response/TaskResponseDTO";
import { Comment } from "../../Domain/models/Comment";

export function mapErrorToStatus(error: ErrorCode): number {
    switch (error) {
        case ErrorCode.TASK_NOT_FOUND:
        case ErrorCode.SPRINT_NOT_FOUND:
            return 404;
        case ErrorCode.FORBIDDEN:
            return 403;
        case ErrorCode.INVALID_INPUT:
            return 400;
        default:
            return 500;
    }
}

export function mapTaskToTaskResponseDTO(task: Task) : TaskResponseDTO
{
    const taskResponse : TaskResponseDTO = {
        task_id: task.task_id,
        sprint_id: task.sprint_id,
        project_manager_id: task.project_manager_id,
        task_description: task.task_description,
        task_status: task.task_status,
        title: task.title,
        worker_id: task.worker_id,
        attachment_file_uuid: task.attachment_file_uuid,
        comments: task.comments?.map(commentToResponseDTO),
        estimated_cost: task.estimated_cost,
        total_hours_spent: task.total_hours_spent
    }
    return taskResponse;
}

export function commentToResponseDTO(comment: Comment): CommentResponseDTO {
    return {
        id: comment.comment_id,
        userId: comment.user_id,
        comment: comment.comment,
        createdAt: comment.created_at,
        taskId: comment.task?.task_id ?? 0, 
    };
}
