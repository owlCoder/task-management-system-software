import { TaskStatus } from "../../enums/TaskStatus";

export interface TaskVersionDTO {
  version_id: number;
  task_id: number;
  version_number: number;
  title: string;
  task_description: string;
  task_status: TaskStatus;
  attachment_file_uuid?: number | null;
  estimated_cost?: number | null;
  total_hours_spent?: number | null;
  worker_id?: number | null;
  due_date?: Date | null;
  created_at: Date;
}
