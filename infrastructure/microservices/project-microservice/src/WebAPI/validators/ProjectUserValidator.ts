import { ProjectUserAssignDTO } from "../../Domain/DTOs/ProjectUserAssignDTO";

export function validateAssignUser(
  data: ProjectUserAssignDTO
): { success: boolean; message?: string } {
  if (!data.project_id || data.project_id <= 0) {
    return { success: false, message: "Invalid project id" };
  }
  if (!data.user_id || data.user_id <= 0) {
    return { success: false, message: "Invalid user id" };
  }
  if (!data.weekly_hours || data.weekly_hours <= 0) {
    return {
      success: false,
      message: "Weekly hours must be a positive number",
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