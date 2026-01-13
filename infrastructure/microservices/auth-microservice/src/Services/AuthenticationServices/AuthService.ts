import bcrypt from "bcryptjs";
import { IAuthService } from "../../Domain/services/IAuthService";
import { LoginUserDTO } from "../../Domain/DTOs/LoginUserDTO";
import { SiemLoginUserDTO } from "../../Domain/DTOs/SiemLoginUserDTO";
import { LoginResponseType } from "../../Domain/types/LoginResponse";
import { IEmailService } from "../../Domain/services/IEmailService";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IUserRepository } from "../../Domain/services/IUserRepository";
import { ILoginStrategy } from "../../Domain/services/ILoginStrategy";

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private passwordStrategy: ILoginStrategy,
    private otpStrategy: ILoginStrategy,
    private emailService: IEmailService,
    private readonly logger: ILogerService
  ) {}

  /**
   * TMSS (Task Management System Software) user authentication
   * Handles login for regular application users (non-SysAdmin)
   */
  async login(data: LoginUserDTO): Promise<LoginResponseType> {
    // const hashedInputPassword = await bcrypt.hash(data.password, 10);
    // console.log("Hashed input password:", hashedInputPassword);

    const user = await this.userRepository.findOne({
      where: { username: data.username },
      relations: ["user_role"],
    });

    if (!user || user.is_deleted) {
      this.logger.log(SeverityEnum.WARN, `Login attempt failed: user not found or deleted for username ${data.username}`);
      return { authenticated: false };
    }

    // Prevent SysAdmin from logging in through TMSS login (they must use SIEM login)
    if (user.user_role.role_name === "SysAdmin") {
      this.logger.log(SeverityEnum.WARN, `TMSS login attempt failed: SysAdmin cannot login through TMSS endpoint for username ${data.username}`);
      return { authenticated: false };
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
    if (!passwordMatches) {
      this.logger.log(SeverityEnum.WARN, `Login attempt failed: invalid password for username ${data.username}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.INFO, `TMSS login successful for user ${data.username} with UID ${user.user_id}`);

    // When email service is down, users can still login using password strategy
    const strategy = this.emailService.isAvailable ? this.otpStrategy : this.passwordStrategy;
    const result = await strategy.authenticate(user);

    return result;
  }

  /**
   * SIEM (Security Information and Event Management) system authentication
   * Handles login for SysAdmin users accessing the SIEM system
   */
  async siemLogin(data: SiemLoginUserDTO): Promise<LoginResponseType> {
    const user = await this.userRepository.findOne({
      where: { username: data.username },
      relations: ["user_role"],
    });

    if (!user || user.is_deleted) {
      this.logger.log(SeverityEnum.WARN, `SIEM login attempt failed: user not found or deleted for username ${data.username}`);
      return { authenticated: false };
    }

    // Only allow SysAdmin role to login through SIEM system
    if (user.user_role.role_name !== "SysAdmin") {
      this.logger.log(SeverityEnum.WARN, `SIEM login attempt failed: user ${data.username} does not have SysAdmin role required for SIEM access`);
      return { authenticated: false };
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
    if (!passwordMatches) {
      this.logger.log(SeverityEnum.WARN, `SIEM login attempt failed: invalid password for username ${data.username}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.INFO, `SIEM login successful for SysAdmin user ${data.username} with UID ${user.user_id}`);

    // When email service is down, users can still login using password strategy
    const strategy = this.emailService.isAvailable ? this.otpStrategy : this.passwordStrategy;
    const result = await strategy.authenticate(user);

    return result;
  }
}
