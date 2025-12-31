export interface ProjectUpdateDTO {
  project_name?: string;
  project_description?: string;
  image_file?: File;  // Dodaj ovo
  image_file_uuid?: string;
  total_weekly_hours_required?: number;
  allowed_budget?: number;
}