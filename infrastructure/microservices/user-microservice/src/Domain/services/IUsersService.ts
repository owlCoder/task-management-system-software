import { UserCreationDTO } from "../DTOs/UserCreationDTO";
import { UserDTO } from "../DTOs/UserDTO";
import { UserUpdateDTO } from "../DTOs/UserUpdateDTO";
import { User } from "../models/User";

export interface IUsersService {
  getAllUsers(): Promise<UserDTO[]>;
  getUserById(id: number): Promise<UserDTO>;
  createUser(user: UserCreationDTO): Promise<UserDTO>;
  logicalyDeleteUserById(user_id: number): Promise<boolean>;
  updateUserById(newUserData: UserUpdateDTO): Promise<UserDTO>;
}
