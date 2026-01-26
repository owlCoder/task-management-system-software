export interface ProjectDTO {
  project_id: number;
  allowed_budget: number;
  start_date: string;
}

export interface SprintDTO {
  sprint_id: number;
  project_id: number;
  start_date: string;
  end_date: string;
}

export interface ProjectUserDTO {
  user_id: number;
  weekly_hours: number;
  added_at: string;
}

export interface TaskDTO {
  task_id: number;
  title: string;
  sprint_id: number;
  estimated_cost: number;
  total_hours_spent: number;
  finished_at: string | null;
}