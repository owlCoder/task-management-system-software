export interface ProjectDTO {
    project_id: number;
    project_name: string;
    project_description: string;
    image_url: string;              // PROMENA: Sada je URL umesto uuid + data
    total_weekly_hours_required: number;
    allowed_budget: number;
}