import { UserDTO } from "../../models/users/UserDTO";
import { UserCreationDTO } from "../../models/users/UserCreationDTO";
import { UserUpdateDTO } from "../../models/users/UserUpdateDTO";
import { UserRoleDTO } from "../../models/users/UserRoleDTO";

export interface IUserAPI {
  getAllUsers(token: string): Promise<UserDTO[]>;
  getUserById(token: string, id: number): Promise<UserDTO>;
  createUser(token: string, user: UserCreationDTO): Promise<UserDTO>;
  logicalyDeleteUserById(token: string, user_id: number): Promise<boolean>;
  updateUser(token: string,id:number, newUserData: UserUpdateDTO): Promise<UserDTO>;
  setWeeklyHours(token: string, user_id: number, weekly_working_hours: number) : Promise<UserDTO>;
  getUserRolesForCreation(token: string, impact_level: number) : Promise<UserRoleDTO[]>;

}
