import bcrypt from "bcryptjs";
import { IAuthService } from "../../Domain/services/IAuthService";
import { LoginUserDTO } from "../../Domain/DTOs/LoginUserDTO";
import { LoginResponseType } from "../../Domain/types/LoginResponse";
import { IEmailService } from "../../Domain/services/IEmailService";
import { ISessionStore } from "../../Domain/services/ISessionStore";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IUserRepository } from "../../Domain/services/IUserRepository";
import { IOTPGenerator } from "../../Domain/services/IOTPGenerator";
import { LoginData } from "../../Domain/models/LoginData";
import { User } from "../../Domain/models/User";
import { v4 as uuidv4 } from 'uuid';

export class AuthService implements IAuthService {
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);

  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private sessionService: ISessionStore,
    private otpGenerator: IOTPGenerator,
    private readonly logger: ILogerService
  ) {}

  private async performOtpLogin(user: User): Promise<LoginResponseType> {
    const otpCode = this.otpGenerator.generateOTP();
    const dateCreated = new Date();
    const sessionData: LoginData = { userId: user.user_id, otpCode: otpCode, dateCreated: dateCreated };
    const sessionId = uuidv4();

    const success = await this.emailService.sendOTPCode(user, otpCode);
    if (!success) return { authenticated: false };

    this.logger.log(SeverityEnum.INFO, `OTP generated for user ${user.username} with UID ${user.user_id}: ${otpCode} and session ID: ${sessionId}`);
    this.sessionService.setSession(sessionId, sessionData);
    return {
      authenticated: true,
      userData: {
        user_id: user.user_id,
        session_id: sessionId,
        otp_required: true,
        iat: Math.floor(sessionData.dateCreated.getTime() / 1000),
        exp: Math.floor(sessionData.dateCreated.getTime() / 1000) + this.loginSessionExpirationMinutes * 60,
      },
    };
  }

  private async performPasswordLogin(user: User): Promise<LoginResponseType> {
    return {
      authenticated: true,
      userData: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.user_role.role_name,
        otp_required: false
      }
    };
  }

  async login(data: LoginUserDTO): Promise<LoginResponseType> {
    // const hashedInputPassword = await bcrypt.hash(data.password, 10);
    // console.log("Hashed input password:", hashedInputPassword);

    const user = await this.userRepository.findOne({
      where: { username: data.username },
      relations: ["user_role"],
    });

    console.log("Retrieved user from DB:", user);

    if (!user || user.is_deleted) {
      this.logger.log(SeverityEnum.WARN, `Login attempt failed: user not found or deleted for username ${data.username}`);
      return { authenticated: false };
    }


    const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
    if (!passwordMatches) {
      this.logger.log(SeverityEnum.WARN, `Login attempt failed: invalid password for username ${data.username}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.INFO, `Login successful for user ${data.username} with UID ${user.user_id}`);
    // ALWAYS use password login for now, so we do not use Mailing service more than necessary, only for development convenience
    // if (this.emailService.isAvailable) {
      // return await this.performOtpLogin(user);
    // } else {
      return await this.performPasswordLogin(user);
    // }
  }
}
