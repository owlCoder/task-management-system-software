import { LoginResponseType } from "../types/LoginResponse";
import { User } from "../models/User";
import { UserDTO } from "../DTOs/UserDTO";

export interface ILoginStrategy {
  authenticate(user: UserDTO): Promise<LoginResponseType>;
}