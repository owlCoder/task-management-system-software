import { UserDTO } from "../DTOs/UserDTO";
import { User } from "../models/User";

export interface IUsersService {
  getAllUsers(): Promise<UserDTO[]>;
  getUserById(id: number): Promise<UserDTO>;
  createUser(user: User): Promise<UserDTO>;
  logicalyDeleteUserById(user_id: number): Promise<boolean>;
  updateUserById(user_id: number, userData: Partial<User>): Promise<UserDTO>;
}
