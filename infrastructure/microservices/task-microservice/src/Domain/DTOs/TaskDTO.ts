import { TaskStatus } from "../enums/TaskStatus";
import { CommentDTO } from "./CommentDTO";

export interface TaskDTO {
    task_id: number;
    sprint_id: number;
    worker_id: number;
    project_manager_id: number;
    title: string;
    task_description: string;
    task_status: TaskStatus;
    estimated_cost?: number;
    total_hours_spent?: number;
    comments?: CommentDTO[];    
}
