export interface ProjectCreateDTO {
    project_name: string;
    project_description: string;
    image_file?: File;              // File za upload
    total_weekly_hours_required: number;
    allowed_budget: number;
}