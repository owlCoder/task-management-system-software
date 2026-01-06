import { ProjectStatus } from "../../enums/project/ProjectStatus";

export interface ProjectDTO {
    project_id: number;
    project_name: string;
    project_description: string;
    image_url: string;
    total_weekly_hours_required: number;
    allowed_budget: number;
    start_date?: Date;
    sprint_count: number;
    sprint_duration: number;
    status: ProjectStatus;
}