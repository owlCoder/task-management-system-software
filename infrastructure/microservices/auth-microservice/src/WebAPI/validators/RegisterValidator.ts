import { RegistrationUserDTO } from "../../Domain/DTOs/RegistrationUserDTO";

export function validateRegistrationData(data: RegistrationUserDTO): { success: boolean; message?: string } {
  if (!data.username || data.username.trim().length < 3 || data.username.length > 15) {
    return { success: false, message: "Username must be between 3 and 15 characters long" };
  }
  if (!data.password || data.password.length < 3) {
    return { success: false, message: "Password must be at least 3 characters long" };
  }
  if (!data.email || data.email.match("[a-zA-Z0-9]+@[a-z]+.[a-z]+") === null) {
    return { success: false, message: "Invalid email address" };
  }
  if (typeof data.role !== "string" || data.role.trim().length === 0) {
    return { success: false, message: "Role must be a string" };
  }
  return { success: true };
}