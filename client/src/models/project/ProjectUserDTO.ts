import type { UserDTO } from "../users/UserDTO";

export type ProjectUserDTO = {
  id?: number;
  projectId: number;
  userId: number;
  role?: UserDTO["role"];
  hoursPerWeek: number; 
  user?: UserDTO; 
}