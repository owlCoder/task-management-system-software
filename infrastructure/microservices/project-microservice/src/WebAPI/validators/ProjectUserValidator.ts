import { ProjectUserAssignDTO } from "../../Domain/DTOs/ProjectUserAssignDTO";

export function validateAssignUser(
    data: ProjectUserAssignDTO
): { success: boolean; message?: string } {
    if (!data.project_id || data.project_id <= 0) {
        return { success: false, message: "Invalid project id" };
    }
    
    if (!data.username || typeof data.username !== 'string' || data.username.trim() === '') {
        return { success: false, message: "Username is required" };
    }
    
    if (data.username.length < 3 || data.username.length > 50) {
        return { success: false, message: "Username must be between 3 and 50 characters" };
    }
    
    if (data.weekly_hours === undefined || data.weekly_hours < 0) {
        return {
            success: false,
            message: "Weekly hours must be a non-negative number",
        };
    }
    
    if (data.weekly_hours > 40) {
        return {
            success: false,
            message: "Weekly hours on a single project cannot exceed 40",
        };
    }
    
    return { success: true };
}