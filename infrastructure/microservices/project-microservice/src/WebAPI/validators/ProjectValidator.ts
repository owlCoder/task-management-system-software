import { ProjectCreateDTO } from "../../Domain/DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/ProjectUpdateDTO";

export function validateCreateProject(
  data: ProjectCreateDTO
): { success: boolean; message?: string } {
  if (!data.project_name || data.project_name.trim().length < 3) {
    return {
      success: false,
      message: "Project name must have at least 3 characters",
    };
  }
  if (!data.project_description || data.project_description.trim().length < 10) {
    return {
      success: false,
      message: "Project description must have at least 10 characters",
    };
  }
  if (!data.image_file_uuid || data.image_file_uuid.trim().length === 0) {
    return { success: false, message: "Image UUID is required" };
  }
  if (data.total_weekly_hours_required <= 0) {
    return {
      success: false,
      message: "Total weekly hours must be a positive number",
    };
  }
  if (data.allowed_budget <= 0) {
    return {
      success: false,
      message: "Allowed budget must be a positive number",
    };
  }
  return { success: true };
}

export function validateUpdateProject(
  data: ProjectUpdateDTO
): { success: boolean; message?: string } {
  if (
    data.project_name !== undefined &&
    data.project_name.trim().length < 3
  ) {
    return {
      success: false,
      message: "Project name must have at least 3 characters",
    };
  }
  if (
    data.project_description !== undefined &&
    data.project_description.trim().length < 10
  ) {
    return {
      success: false,
      message: "Project description must have at least 10 characters",
    };
  }
  return { success: true };
}