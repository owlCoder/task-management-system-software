import { UserDTO } from "../Domain/DTOs/UserDTO";
import { User } from "../Domain/models/User";

/**
 * Convert User entity to UserDTO
 */
export function toDTO(user: User): UserDTO {
  return {
    user_id: user.user_id,
    username: user.username,
    role_name: user.user_role.role_name, //uzimamo role_name jer ucitavaju objekat get funkcije
    email: user.email,
    weekly_working_hour_sum: user.weekly_working_hour_sum,
  };
}
