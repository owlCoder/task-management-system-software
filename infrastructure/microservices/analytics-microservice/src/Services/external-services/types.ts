export interface ProjectDTO {
  project_id: number;
  allowed_budget: number;
}

export interface SprintDTO {
  sprint_id: number;
  project_id: number;
}

export interface ProjectUserDTO {
  user_id: number;
  weekly_hours: number;
}

export interface TaskDTO {
  sprint_id: number;
  estimated_cost?: number;
}
