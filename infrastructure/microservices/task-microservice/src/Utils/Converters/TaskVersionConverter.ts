import { TaskVersion } from "../../Domain/models/TaskVersion";
import { TaskVersionDTO } from "../../Domain/DTOs/TaskVersionDTO";

export function taskVersionToDTO(v: TaskVersion): TaskVersionDTO {
  return {
    version_id: v.version_id,
    task_id: v.task_id,
    version_number: v.version_number,
    title: v.title,
    task_description: v.task_description,
    task_status: v.task_status,
    attachment_file_uuid: v.attachment_file_uuid,
    estimated_cost: v.estimated_cost,
    total_hours_spent: v.total_hours_spent,
    worker_id: v.worker_id,
    due_date: v.due_date,
    created_at: v.created_at,
  };
}