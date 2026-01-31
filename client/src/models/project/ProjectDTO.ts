import { ProjectStatus } from "../../enums/ProjectStatus";

export interface ProjectDTO {
    project_id: number;
    project_name: string;
    project_description: string;
    image_url: string;
    total_weekly_hours_required: number;
    allowed_budget: number;
    start_date: string | null;
    status: ProjectStatus;
}