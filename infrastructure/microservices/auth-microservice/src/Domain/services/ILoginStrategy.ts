import { LoginResponseType } from "../types/LoginResponse";
import { UserDTO } from "../DTOs/UserDTO";

export interface ILoginStrategy {
  authenticate(user: UserDTO): Promise<LoginResponseType>;
}