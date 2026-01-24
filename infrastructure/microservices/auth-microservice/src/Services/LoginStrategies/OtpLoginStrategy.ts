import { ILoginStrategy } from "../../Domain/services/ILoginStrategy";
import { LoginResponseType } from "../../Domain/types/LoginResponse";
import { IEmailService } from "../../Domain/services/IEmailService";
import { ISessionStore } from "../../Domain/services/ISessionStore";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IOTPGenerator } from "../../Domain/services/IOTPGenerator";
import { LoginData } from "../../Domain/models/LoginData";
import { v4 as uuidv4 } from 'uuid';
import { UserDTO } from "../../Domain/DTOs/UserDTO";

export class OtpLoginStrategy implements ILoginStrategy {
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);

  constructor(
    private emailService: IEmailService,
    private sessionService: ISessionStore,
    private otpGenerator: IOTPGenerator,
    private readonly logger: ILogerService
  ) {}

  async authenticate(user: UserDTO): Promise<LoginResponseType> {
    const otpCode = this.otpGenerator.generateOTP();
    const dateCreated = new Date();
    const sessionData: LoginData = { userId: user.user_id, otpCode: otpCode, dateCreated: dateCreated };
    const sessionId = uuidv4();

    const success = await this.emailService.sendOTPCode(user, otpCode);
    if (!success) {
      this.logger.log(SeverityEnum.ERROR, `Failed to send OTP email to user ${user.username}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.INFO, `OTP generated for user ${user.username} with UID ${user.user_id}: ${otpCode} and session ID: ${sessionId}`);
    this.sessionService.setSession(sessionId, sessionData);

    this.logger.log(SeverityEnum.INFO, `OTP authentication initiated for user ${user.username} with session ID: ${sessionId}`);

    return {
      authenticated: true,
      userData: {
        user_id: user.user_id,
        google_id_required : false,
        session_id: sessionId,
        otp_required: true,
        iat: Math.floor(sessionData.dateCreated.getTime() / 1000),
        exp: Math.floor(sessionData.dateCreated.getTime() / 1000) + this.loginSessionExpirationMinutes * 60,
      },
    };
  }
}