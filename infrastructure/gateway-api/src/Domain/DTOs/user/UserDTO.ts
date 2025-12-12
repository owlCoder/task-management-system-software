import { UserRole } from "../../enums/user/UserRole";

export interface UserDTO {
  user_id: number;
  username: string;
  role_name: UserRole;
  email: string;
  weekly_working_hour_sum?: number;
}