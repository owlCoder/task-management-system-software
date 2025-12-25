export interface CreateTaskDTO {
  sprint_id: number;
  worker_id: number;
  project_manager_id: number;
  title: string;
  task_description: string;  
  attachment_file_uuid: number;
  estimated_cost: number;
  total_hours_spent: number;
}