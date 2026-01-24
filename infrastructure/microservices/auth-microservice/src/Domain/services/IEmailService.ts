import { UserDTO } from "../DTOs/UserDTO";
import { User } from "../models/User";

export interface IEmailService {
  isAvailable: boolean;
  sendOTPCode(user: UserDTO, otpCode: string): Promise<boolean>;
}