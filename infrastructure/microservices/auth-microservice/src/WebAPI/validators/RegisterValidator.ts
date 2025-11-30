import { RegistrationUserDTO } from "../../Domain/DTOs/RegistrationUserDTO";

export function validateRegistrationData(data: RegistrationUserDTO): { success: boolean; message?: string } {
  console.log("Validating registration data:", data);
  if (!data.username || data.username.trim().length < 3) {
    return { success: false, message: "Username must be at least 3 characters long" };
  }
  if (!data.password || data.password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long" };
  }
  if (!data.email || !data.email.includes("@")) {
    return { success: false, message: "Invalid email address" };
  }
  if (typeof data.role !== "string") {
    return { success: false, message: "Role must be a string" + data.role };
  }
  return { success: true };
}