import axios from "axios";
import { User } from "../../Domain/models/User";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IEmailService } from "../../Domain/services/IEmailService";
import { IHealthChecker } from "../../Domain/services/IHealthChecker";
import { EmailTemplates } from "./EmailTemplates";
import { buildEmailServiceUrl } from "./EmailUrlHelper";
import { UserDTO } from "../../Domain/DTOs/UserDTO";

export class EmailService implements IEmailService {
  private readonly emailServiceUrl: string = buildEmailServiceUrl();
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);
  private readonly logger: ILogerService;
  private readonly healthChecker: IHealthChecker;

  constructor(logger: ILogerService, healthChecker: IHealthChecker) {
    this.logger = logger;
    this.healthChecker = healthChecker;
  }

  public get isAvailable(): boolean {
    return this.healthChecker.isAvailable;
  }

  async sendOTPCode(user: UserDTO, otpCode: string): Promise<boolean> {
    // Email content
    const emailSubject = EmailTemplates.getOTPLoginSubject(user.username);
    const emailBody = EmailTemplates.getOTPLoginBody(user.username, otpCode, this.loginSessionExpirationMinutes);

    try {
      await axios.post(
        `${this.emailServiceUrl}/SendMessage`,
        {
          user: user.email,
          header: emailSubject,
          message: emailBody
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000
        }
      );

      this.logger.log(SeverityEnum.DEBUG,`\x1b[34m[MailingService]\x1b[0m Sent OTP email to ${user.email} for user ${user.username}`);
      this.logger.log(SeverityEnum.DEBUG,`\x1b[34m[MailingService]\x1b[0m Email content:\nSubject: ${emailSubject}\nBody: ${emailBody}`);

      this.logger.log(SeverityEnum.INFO, `Sent OTP email to ${user.email} for user ${user.username} and UID ${user.user_id} with OTP: ${otpCode}`);
      return true;
    } catch (error) {
      this.logger.log(SeverityEnum.ERROR, `Failed to send OTP email: ${error}`);
      return false;
    }
  }
}