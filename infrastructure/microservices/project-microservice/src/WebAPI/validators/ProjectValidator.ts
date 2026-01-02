import { ProjectCreateDTO } from "../../Domain/DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/ProjectUpdateDTO";

interface ValidationResult {
    success: boolean;
    message?: string;
}

export function validateCreateProject(data: ProjectCreateDTO): ValidationResult {
    if (!data.project_name || data.project_name.trim() === "") {
        return { success: false, message: "Project name is required" };
    }
    if (data.project_name.length > 100) {
        return { success: false, message: "Project name must be 100 characters or less" };
    }
    if (isNaN(data.total_weekly_hours_required) || data.total_weekly_hours_required <= 0) {
        return { success: false, message: "Total weekly hours must be a positive number" };
    }
    if (isNaN(data.allowed_budget) || data.allowed_budget <= 0) {
        return { success: false, message: "Allowed budget must be a positive number" };
    }
    return { success: true };
}

export function validateUpdateProject(data: ProjectUpdateDTO): ValidationResult {
    if (data.project_name !== undefined) {
        if (data.project_name.trim() === "") {
            return { success: false, message: "Project name cannot be empty" };
        }
        if (data.project_name.length > 100) {
            return { success: false, message: "Project name must be 100 characters or less" };
        }
    }
    if (data.total_weekly_hours_required !== undefined) {
        if (isNaN(data.total_weekly_hours_required) || data.total_weekly_hours_required <= 0) {
            return { success: false, message: "Total weekly hours must be a positive number" };
        }
    }
    if (data.allowed_budget !== undefined) {
        if (isNaN(data.allowed_budget) || data.allowed_budget <= 0) {
            return { success: false, message: "Allowed budget must be a positive number" };
        }
    }
    return { success: true };
}