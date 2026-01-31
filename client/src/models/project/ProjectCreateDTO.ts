import { ProjectStatus } from "../../enums/ProjectStatus";

export interface ProjectCreateDTO {
    project_name: string;
    project_description: string;
    image_file?: File;
    total_weekly_hours_required: number;
    allowed_budget: number;
    creator_username?: string;
    start_date: string | null;
    status: ProjectStatus;
}