import { TaskStatus } from "../../../Domain/enums/TaskStatus";
import { CommentResponseDTO } from "./CommentResponseDTO";

export interface TaskResponseDTO {
    task_id: number;
    sprint_id: number;
    worker_id: number;
    project_manager_id: number;
    title: string;
    task_description: string;
    task_status: TaskStatus;
    attachment_file_uuid?: number;
    estimated_cost?: number;
    total_hours_spent?: number;
    comments?: CommentResponseDTO[];    
}