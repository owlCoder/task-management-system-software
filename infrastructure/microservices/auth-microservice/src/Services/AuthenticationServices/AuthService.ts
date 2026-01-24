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
import { GoogleUserInfoDTO } from "../../Domain/DTOs/GoogleUserInfoDTO";
import { IRoleRepository } from "../../Domain/services/IRoleRepository";
import { LoginTokenClaims } from "../../Domain/types/LoginTokenClaims";

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private passwordStrategy: ILoginStrategy,
    private otpStrategy: ILoginStrategy,
    private emailService: IEmailService,
    private readonly logger: ILogerService,
    private userRoleRepository: IRoleRepository
  ) { }

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
    if (user.password_hash != null) {
      const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
      if (!passwordMatches) {
        this.logger.log(SeverityEnum.WARN, `Login attempt failed: invalid password for username ${data.username}`);
        return { authenticated: false };
      }
    }
    this.logger.log(SeverityEnum.INFO, `TMSS login successful for user ${data.username} with UID ${user.user_id}`);

    // In development mode, skip email/OTP and use password strategy directly
    const isDevelopment = process.env.NODE_ENV === 'development';
    const strategy = isDevelopment || !this.emailService.isAvailable ? this.passwordStrategy : this.otpStrategy;
    const userDTO = {
      user_id: user.user_id,
      username: user.username ?? "username",
      user_role: user.user_role,
      email: user.email,
      image_url: user.image_url
    }
    const result = await strategy.authenticate(userDTO);

    return result;
  }

  async googleLogin(data: GoogleUserInfoDTO): Promise<LoginResponseType> {

    let user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ["user_role"],
    });
    console.log("CAO");
    if (user == null) {
      const role = await this.userRoleRepository.findOne({ where: { role_name: "Project Manager" } });
      console.log(role);
      const newUser = this.userRepository.create({
        email: data.email,
        image_url: data.picture,
        user_role: role?.user_role_id,
        google_id: data.sub
      });

      user = await this.userRepository.save(newUser);
      this.logger.log(SeverityEnum.INFO, `New user registered via Google: ${data.email}`);
    }
    else {
      if (user.is_deleted) {
        this.logger.log(SeverityEnum.WARN, `Login attempt failed: user not found or deleted for email ${data.email}`);
        return { authenticated: false };
      }

      // Prevent SysAdmin from logging in through TMSS login (they must use SIEM login)
      if (user.user_role.role_name === "SysAdmin") {
        this.logger.log(SeverityEnum.WARN, `TMSS login attempt failed: SysAdmin cannot login through TMSS endpoint for email ${data.email}`);
        return { authenticated: false };
      }
    }

    this.logger.log(SeverityEnum.INFO, `TMSS login successful for user with email ${data.email} with UID ${user.user_id}`);

    // In development mode, skip email/OTP and use password strategy directly
    const isDevelopment = process.env.NODE_ENV === 'development';
    const strategy = isDevelopment || !this.emailService.isAvailable ? this.passwordStrategy : this.otpStrategy;
    const userDTO: LoginTokenClaims = {
      user_id: user.user_id,
      google_id: user.google_id || data.sub,
      google_id_required: true,
      email: user.email,
      role: user.user_role.role_name,
      image_url: user.image_url ?? undefined,
      otp_required: false,
      username: user.email
    };

    return { authenticated: true, userData: userDTO };
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
    if (user.password_hash != null) {
      const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
      if (!passwordMatches) {
        this.logger.log(SeverityEnum.WARN, `SIEM login attempt failed: invalid password for username ${data.username}`);
        return { authenticated: false };
      }
    }

    this.logger.log(SeverityEnum.INFO, `SIEM login successful for SysAdmin user ${data.username} with UID ${user.user_id}`);

    // In development mode, skip email/OTP and use password strategy directly
    const isDevelopment = process.env.NODE_ENV === 'development';
    const strategy = isDevelopment || !this.emailService.isAvailable ? this.passwordStrategy : this.otpStrategy;
    const userDTO = {
      user_id: user.user_id,
      username: user.username ?? "username",
      user_role: user.user_role,
      email: user.email,
      image_url: user.image_url
    }
    const result = await strategy.authenticate(userDTO);

    return result;
  }
}
