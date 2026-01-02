import { Project } from "../../Domain/models/Project";
import { ProjectDTO } from "../../Domain/DTOs/ProjectDTO";

export const ProjectMapper = {
    toDTO(project: Project): ProjectDTO {
        return {
            project_id: project.project_id,
            project_name: project.project_name,
            project_description: project.project_description,
            image_url: project.image_url || "",
            total_weekly_hours_required: project.total_weekly_hours_required,
            allowed_budget: project.allowed_budget,
        };
    },
};