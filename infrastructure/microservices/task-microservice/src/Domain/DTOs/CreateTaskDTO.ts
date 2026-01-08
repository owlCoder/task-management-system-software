export interface CreateTaskDTO {
  worker_id: number;
  title: string;
  task_description: string;  
  estimated_cost?: number;
  project_manager_id: number;
}
