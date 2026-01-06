import { ProjectStatus } from "../../enums/ProjectStatus";

export interface ProjectUpdateDTO {
    project_name?: string;
    project_description?: string;
    image_file?: File;
    total_weekly_hours_required?: number;
    allowed_budget?: number;
    start_date?: string | null;
    sprint_count?: number;
    sprint_duration?: number;
    status?: ProjectStatus;
}