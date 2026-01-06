import { UserCreationDTO } from "../DTOs/UserCreationDTO";
import { UserDTO } from "../DTOs/UserDTO";
import { UserUpdateDTO } from "../DTOs/UserUpdateDTO";
import { Result } from "../types/Result";

export interface IUsersService {
  getAllUsers(): Promise<Result<UserDTO[]>>;
  getUserById(id: number): Promise<Result<UserDTO>>;
  getUserByUsername(username: string): Promise<Result<UserDTO>>;
  getUsersByIds(ids: number[]): Promise<Result<UserDTO[]>>;
  createUser(user: UserCreationDTO): Promise<Result<UserDTO>>;
  logicalyDeleteUserById(user_id: number): Promise<Result<void>>;
  updateUserById(
    user_id: number,
    updateUserData: UserUpdateDTO
  ): Promise<Result<UserDTO>>;
  setWeeklyHours(
    user_id: number,
    weekly_working_hour_sum: number
  ): Promise<Result<UserDTO>>;
}
