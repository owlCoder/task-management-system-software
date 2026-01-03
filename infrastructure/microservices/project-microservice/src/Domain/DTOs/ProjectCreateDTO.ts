export interface ProjectCreateDTO {
    project_name: string;
    project_description: string;
    image_key?: string;
    image_url?: string;
    total_weekly_hours_required: number;
    allowed_budget: number;
    user_id?: number;
}