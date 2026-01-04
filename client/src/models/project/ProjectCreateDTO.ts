import { ProjectStatus } from "../../enums/ProjectStatus";

export interface ProjectCreateDTO {
    project_name: string;
    project_description: string;
    image_file?: File;
    total_weekly_hours_required: number;
    allowed_budget: number;
    user_id?: number;
    creator_weekly_hours?: number;
    start_date: string | null;
    sprint_count: number;
    sprint_duration: number;
    status: ProjectStatus;
}