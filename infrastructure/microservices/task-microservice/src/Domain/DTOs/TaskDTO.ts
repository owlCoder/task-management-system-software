import { TaskStatus } from "../enums/task_status";

export interface TaskDTO {
    task_id: number;
    project_id: number;
    title: string;
    task_description: string;
    task_status: TaskStatus;
    attachment_file_uuid?: number;
    estimated_cost?: number;
    total_hours_spent?: number;
}