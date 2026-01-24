import { UserDTO } from "../../Domain/DTOs/UserDTO";
import { User } from "../../Domain/models/User";

/**
 * Convert User entity to UserDTO
 */
export function toUserDTO(user: User): UserDTO {
  return {
    user_id: user.user_id,
    username: user.username ?? "",
    role_name: user.user_role.role_name, //uzimamo role_name jer ucitavaju objekat get funkcije
    email: user.email,
    image_url: user.image_url || "",
    weekly_working_hour_sum: user.weekly_working_hour_sum,
    google_id: user.google_id ?? "",
  };
}