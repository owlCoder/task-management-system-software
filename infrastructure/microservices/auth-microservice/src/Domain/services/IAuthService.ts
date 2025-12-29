import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { LoginResponseType } from "../types/LoginResponse";

export interface IAuthService {
  login(data: LoginUserDTO): Promise<LoginResponseType>;
}
