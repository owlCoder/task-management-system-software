import { UserDTO } from "../../models/users/UserDTO";
import { UserCreationDTO } from "../../models/users/UserCreationDTO";

export interface IUserAPI {
  getAllUsers(token: string): Promise<UserDTO[]>;
  getUserById(token: string, id: number): Promise<UserDTO>;
  createUser(token: string, user: UserCreationDTO) : Promise<UserDTO>;
  deleteUser(token: string, id: number) : Promise<void>;
  updateUser(token: string, id: number, user: Partial<UserDTO>) : Promise<UserDTO>;
}