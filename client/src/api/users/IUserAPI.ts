import { UserDTO } from "../../models/users/UserDTO";
import { UserCreationDTO } from "../../models/users/UserCreationDTO";
import { UserUpdateDTO } from "../../models/users/UserUpdateDTO";

export interface IUserAPI {
  getAllUsers(token: string): Promise<UserDTO[]>;
  getUserById(token: string, id: number): Promise<UserDTO>;
  createUser(token: string, user: UserCreationDTO): Promise<UserDTO>;
  logicalyDeleteUserById(token: string, user_id: number): Promise<boolean>;
  updateUserById(token: string, newUserData: UserUpdateDTO): Promise<UserDTO>;
}
