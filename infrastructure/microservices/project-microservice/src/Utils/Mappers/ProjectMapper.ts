import { Project } from "../../Domain/models/Project";
import { ProjectDTO } from "../../Domain/DTOs/ProjectDTO";

export const ProjectMapper = {
    toDTO(project: Project): ProjectDTO {
        let startDateStr: string | null = null;
        
        if (project.start_date) {
            // Ako je Date objekat
            if (project.start_date instanceof Date) {
                startDateStr = project.start_date.toISOString().split('T')[0];
            } 
            // Ako je već string (TypeORM ponekad vrati string za DATE kolonu)
            else if (typeof project.start_date === 'string') {
                // Ako je ISO format, uzmi samo datum
                startDateStr = (project.start_date as string).split('T')[0];
            }
        }

        return {
            project_id: project.project_id,
            project_name: project.project_name,
            project_description: project.project_description,
            image_url: project.image_url || "",
            total_weekly_hours_required: project.total_weekly_hours_required,
            allowed_budget: project.allowed_budget,
            start_date: startDateStr,
            sprint_count: project.sprint_count || 1,
            sprint_duration: project.sprint_duration || 14,
            status: project.status,
        };
    },
};