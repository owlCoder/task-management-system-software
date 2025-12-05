import { CommentDTO } from "../../Domain/DTOs/CommentDTO";
import { TaskDTO } from "../../Domain/DTOs/TaskDTO";
import { TaskStatus } from "../../Domain/enums/task_status";
import { Task } from "../../Domain/models/Task";
import { TaskResponse } from "../../Domain/types/TaskResponse";
import { Comment } from "../../Domain/models/Comment";


 export function commentToDTO(comment: Comment): CommentDTO {
        return {
            comment_id: comment.comment_id,
            user_id: comment.user_id,
            comment: comment.comment,
            task_id: comment.task.task_id,
            created_at: comment.created_at
        };
    }

export   function taskToDTO(task: Task): TaskDTO {
        return {
            task_id: task.task_id,
            project_id: task.project_id,
            worker_id: task.worker_id,
            project_manager_id: task.project_manager_id,
            title: task.title,
            task_description: task.task_description,
            task_status: task.task_status,
            attachment_file_uuid: task.attachment_file_uuid,
            estimated_cost: task.estimated_cost,
            total_hours_spent: task.total_hours_spent,
            comments: task.comments ? task.comments.map(c => commentToDTO(c)) : []
        };
    }
