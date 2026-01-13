import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { SiemLoginUserDTO } from "../DTOs/SiemLoginUserDTO";
import { LoginResponseType } from "../types/LoginResponse";

export interface IAuthService {
  /**
   * Authenticates TMSS (Task Management System Software) users
   * Only non-SysAdmin users can login through this method
   */
  login(data: LoginUserDTO): Promise<LoginResponseType>;

  /**
   * Authenticates SIEM (Security Information and Event Management) system users
   * Only SysAdmin users can login through this method
   */
  siemLogin(data: SiemLoginUserDTO): Promise<LoginResponseType>;
}
