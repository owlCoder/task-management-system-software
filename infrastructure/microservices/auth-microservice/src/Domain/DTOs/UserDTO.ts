import { UserRole } from "../models/UserRole";

export class UserDTO {
  user_id!: number;
  username!: string;
  user_role!: UserRole;
  email!: string;
  image_url!: string | null; 
}