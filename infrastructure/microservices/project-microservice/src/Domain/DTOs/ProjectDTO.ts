export interface ProjectDTO {
  project_id: number;
  project_name: string;
  project_description: string;
  image_file_uuid: string;
  image_data?: string;           // base64 encoded image
  image_content_type?: string;   // mime type (e.g., 'image/jpeg')
  total_weekly_hours_required: number;
  allowed_budget: number;
}