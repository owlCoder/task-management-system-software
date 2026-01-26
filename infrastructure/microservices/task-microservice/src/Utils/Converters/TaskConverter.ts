import { Task } from "../../Domain/models/Task";
import { TaskDTO } from "../../Domain/DTOs/TaskDTO";

export function taskToTaskDTO(task: Task): TaskDTO {
    return {
        task_id: task.task_id,
        sprint_id: task.sprint_id,
        worker_id: task.worker_id,
        title: task.title,
        task_description: task.task_description,
        task_status: task.task_status,
        attachment_file_uuid: task.attachment_file_uuid,
        estimated_cost: task.estimated_cost,
        total_hours_spent: task.total_hours_spent,
        project_manager_id: task.project_manager_id,
        comments: task.comments?.map(c => ({
            comment_id: c.comment_id,
            user_id: c.user_id,
            comment: c.comment,
            created_at: c.created_at,
            task_id: task.task_id
        })),
        finished_at: task.finished_at ? task.finished_at.toISOString() : null,  // ← DODAJ
        created_at: task.created_at ? task.created_at.toISOString() : null,
    };
}
