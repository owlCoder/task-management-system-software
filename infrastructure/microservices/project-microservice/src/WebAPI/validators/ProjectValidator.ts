import { ProjectCreateDTO } from "../../Domain/DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/ProjectUpdateDTO";
import { ProjectStatus } from "../../Domain/enums/ProjectStatus";

interface ValidationResult {
    success: boolean;
    message?: string;
}

const validStatuses = Object.values(ProjectStatus);

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
    if (isNaN(data.sprint_count) || data.sprint_count <= 0) {
        return { success: false, message: "Sprint count must be a positive number" };
    }
    if (isNaN(data.sprint_duration) || data.sprint_duration <= 0) {
        return { success: false, message: "Sprint duration must be a positive number" };
    }
    if (data.status && !validStatuses.includes(data.status)) {
        return { success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` };
    }
    if (data.start_date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.start_date)) {
            return { success: false, message: "Start date must be in YYYY-MM-DD format" };
        }
        const parsedDate = new Date(data.start_date);
        if (isNaN(parsedDate.getTime())) {
            return { success: false, message: "Invalid start date" };
        }
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
    if (data.sprint_count !== undefined) {
        if (isNaN(data.sprint_count) || data.sprint_count <= 0) {
            return { success: false, message: "Sprint count must be a positive number" };
        }
    }
    if (data.sprint_duration !== undefined) {
        if (isNaN(data.sprint_duration) || data.sprint_duration <= 0) {
            return { success: false, message: "Sprint duration must be a positive number" };
        }
    }
    if (data.status !== undefined && !validStatuses.includes(data.status)) {
        return { success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` };
    }
    if (data.start_date !== undefined && data.start_date !== null && data.start_date !== "") {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.start_date)) {
            return { success: false, message: "Start date must be in YYYY-MM-DD format" };
        }
        const parsedDate = new Date(data.start_date);
        if (isNaN(parsedDate.getTime())) {
            return { success: false, message: "Invalid start date" };
        }
    }
    return { success: true };
}