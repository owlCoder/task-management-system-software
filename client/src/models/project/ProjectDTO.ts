export interface ProjectDTO {
  project_id: number;
  project_name: string;
  project_description: string;
  image_file_uuid: string;
  total_weekly_hours_required: number;
  allowed_budget: number;
}

/*export type ProjectDTO = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  members: ProjectUserDTO[];
  totalWeeklyHours?: number;
  allowedBudget?: number;
  status?: ProjectStatus;
  numberOfSprints?: number;     
  sprintDuration?: number;
  startDate?: string; 
};*/