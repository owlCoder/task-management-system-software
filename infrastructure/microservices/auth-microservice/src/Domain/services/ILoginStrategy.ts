import { LoginResponseType } from "../types/LoginResponse";
import { User } from "../models/User";

export interface ILoginStrategy {
  authenticate(user: User): Promise<LoginResponseType>;
}