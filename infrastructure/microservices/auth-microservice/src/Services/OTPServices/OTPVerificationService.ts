import { BrowserData } from "../../Domain/models/BrowserData";
import { LoginResponseType } from "../../Domain/types/LoginResponse";
import { AuthResponseType } from "../../Domain/types/AuthResponse";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IOTPVerificationService } from "../../Domain/services/IOTPVerificationService";
import { IUserRepository } from "../../Domain/services/IUserRepository";
import { IEmailService } from "../../Domain/services/IEmailService";
import { ISessionStore } from "../../Domain/services/ISessionStore";
import { IOTPGenerator } from "../../Domain/services/IOTPGenerator";
import { LoginData } from "../../Domain/models/LoginData";
import { v4 as uuidv4 } from 'uuid';

export class OTPVerificationService implements IOTPVerificationService {
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);
  private readonly logger: ILogerService;

  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private sessionService: ISessionStore,
    private otpGenerator: IOTPGenerator,
    logger: ILogerService
  ) {
    this.logger = logger;
  }

  async resendOTP(browserData: BrowserData): Promise<LoginResponseType> {
    const user = await this.userRepository.findOne({
      where: { user_id: browserData.user_id },
      relations: ["user_role"],
    });
    if (!user || user.is_deleted) return { authenticated: false };
    const session = this.sessionService.validateSession(browserData.session_id, browserData.user_id, this.loginSessionExpirationMinutes * 60 * 1000);
    if (!session) return { authenticated: false };
    if (this.emailService.isAvailable) {
      const otpCode = this.otpGenerator.generateOTP();
      const dateCreated = new Date();
      const newSessionData: LoginData = { userId: user.user_id, otpCode: otpCode, dateCreated: dateCreated };
      const newSessionId = uuidv4();

      const success = await this.emailService.sendOTPCode(user, otpCode);
      if (!success) return { authenticated: false };

      this.sessionService.deleteSession(browserData.session_id); // Invalidate old session to prevent reuse
      this.sessionService.setSession(newSessionId, newSessionData);

      return {
        authenticated: true,
        userData: {
          user_id: user.user_id,
          session_id: newSessionId,
          otp_required: true,
          iat: Math.floor(newSessionData.dateCreated.getTime() / 1000),
          exp: Math.floor(newSessionData.dateCreated.getTime() / 1000) + this.loginSessionExpirationMinutes * 60,
        },
      };
    }
    else {
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
  }

  async verifyOTP(browserData: BrowserData, otp: string): Promise<AuthResponseType> {
    const user = await this.userRepository.findOne({
      where: { user_id: browserData.user_id },
      relations: ["user_role"],
    });
    if (!user || user.is_deleted) return { authenticated: false };
    this.logger.log(SeverityEnum.INFO, `Verifying OTP for user ${user.username} with UID ${user.user_id} and session ID: ${browserData.session_id} with OTP: ${otp}`);
    const session = this.sessionService.validateSession(browserData.session_id, browserData.user_id, this.loginSessionExpirationMinutes * 60 * 1000);
    console.log(session);
    if (!session) return { authenticated: false };

    if (session.otpCode !== otp) {
      return { authenticated: false };
    }

    this.sessionService.deleteSession(browserData.session_id);

    return {
      authenticated: true,
      userData: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.user_role.role_name,
      }
    };
  }
}