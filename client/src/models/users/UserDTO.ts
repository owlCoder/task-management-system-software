import { UserRole } from "../../enums/UserRole";
export interface UserDTO {
  user_id: number;
  username: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  weekly_working_hour_sum?: number;
}