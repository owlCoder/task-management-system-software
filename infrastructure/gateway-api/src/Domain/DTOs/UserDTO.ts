import { UserRole } from "../enums/UserRole";

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  profileImage: string;
}