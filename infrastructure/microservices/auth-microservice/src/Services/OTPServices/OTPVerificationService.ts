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

  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private sessionService: ISessionStore,
    private otpGenerator: IOTPGenerator,
    private logger: ILogerService
  ) {
  }

  async resendOTP(browserData: BrowserData): Promise<LoginResponseType> {
    this.logger.log(SeverityEnum.DEBUG, `Starting OTP resend workflow for user_id: ${browserData.user_id}, session_id: ${browserData.session_id}`);

    const user = await this.userRepository.findOne({
      where: { user_id: browserData.user_id },
      relations: ["user_role"],
    });

    this.logger.log(SeverityEnum.DEBUG, `User lookup completed for resend OTP`);

    if (!user || user.is_deleted) {
      this.logger.log(SeverityEnum.WARN, `OTP resend failed: user not found or deleted for user_id ${browserData.user_id}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.DEBUG, `Validating session for resend OTP`);
    const session = this.sessionService.validateSession(browserData.session_id, browserData.user_id);
    if (!session) {
      this.logger.log(SeverityEnum.WARN, `OTP resend failed: invalid session for user_id ${browserData.user_id}`);
      return { authenticated: false };
    }

    if (this.emailService.isAvailable) {
      this.logger.log(SeverityEnum.DEBUG, `Email service available, generating new OTP`);
      const otpCode = this.otpGenerator.generateOTP();
      const dateCreated = new Date();
      const newSessionData: LoginData = { userId: user.user_id, otpCode: otpCode, dateCreated: dateCreated };
      const newSessionId = uuidv4();

      this.logger.log(SeverityEnum.DEBUG, `Sending OTP code via email to user ${user.username}`);
      const success = await this.emailService.sendOTPCode(user, otpCode);
      if (!success) {
        this.logger.log(SeverityEnum.ERROR, `Failed to send OTP email to user ${user.username}`);
        return { authenticated: false };
      }

      this.logger.log(SeverityEnum.DEBUG, `Invalidating old session and creating new one`);
      this.sessionService.deleteSession(browserData.session_id); // Invalidate old session to prevent reuse
      this.sessionService.setSession(newSessionId, newSessionData);

      this.logger.log(SeverityEnum.INFO, `OTP resent successfully for user ${user.username}`);

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
        this.logger.log(SeverityEnum.WARN, `Email service unavailable, proceeding with password-only login for user ${user.username}`);
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
    this.logger.log(SeverityEnum.DEBUG, `Starting OTP verification workflow for user_id: ${browserData.user_id}, session_id: ${browserData.session_id}`);

    const user = await this.userRepository.findOne({
      where: { user_id: browserData.user_id },
      relations: ["user_role"],
    });

    this.logger.log(SeverityEnum.DEBUG, `User lookup completed for OTP verification`);

    if (!user || user.is_deleted) {
      this.logger.log(SeverityEnum.WARN, `OTP verification failed: user not found or deleted for user_id ${browserData.user_id}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.DEBUG, `Validating session for OTP verification`);
    const session = this.sessionService.validateSession(browserData.session_id, browserData.user_id);
    if (!session) {
      this.logger.log(SeverityEnum.WARN, `OTP verification failed: invalid session for user_id ${browserData.user_id}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.DEBUG, `Comparing provided OTP with stored OTP`);
    if (session.otpCode !== otp) {
      this.logger.log(SeverityEnum.WARN, `OTP verification failed: invalid OTP code for user ${user.username}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.DEBUG, `OTP verified successfully, cleaning up session`);
    this.sessionService.deleteSession(browserData.session_id);

    this.logger.log(SeverityEnum.INFO, `OTP verification successful for user ${user.username}`);

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