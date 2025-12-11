import axios from "axios";
import { User } from "../Domain/models/User";
import { LoginData } from "../Domain/models/LoginData";
import { v4 as uuidv4 } from 'uuid';
import { randomInt } from "crypto";
import { ILogerService } from "../Domain/services/ILogerService";
import { SeverityEnum } from "../Domain/enums/SeverityEnum";

export class EmailService {
  private readonly emailServiceUrl: string = `${process.env.MAIL_SERVICE_HOST || 'http://localhost'}:${process.env.MAIL_SERVICE_PORT || '6245'}`;
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);
  private readonly mailingServiceHealthCheckInterval: number = 60000;
  private mailingServiceState: boolean = false;
  private readonly logger: ILogerService;

  constructor(logger: ILogerService) {
    this.logger = logger;
    // Start periodic health check (every 60 seconds; adjust as needed)
    setInterval(() => this.checkEmailServiceHealth(), this.mailingServiceHealthCheckInterval);
    // Initial check
    this.checkEmailServiceHealth();
  }

  public get isAvailable(): boolean {
    return this.mailingServiceState;
  }

  async checkEmailServiceHealth(): Promise<void> {
    try {
      const response = await axios.get(`${this.emailServiceUrl}/health`, {
        timeout: 2000,
        headers: { 'Content-Type': 'application/json' }
      });
      this.logger.log(SeverityEnum.INFO, 'Email service connected');
      this.mailingServiceState = response.status === 200;
      // this.mailingServiceState = true; // For testing purposes, assume always available, until mailing service healthcheck is implemented
    } catch (error) {
      // console.log(`\x1b[31m[MailingService]\x1b[0m Email service is currently unavailable, retrying the connection in ${this.mailingServiceHealthCheckInterval / 1000}s.`);
      this.mailingServiceState = false;
    }
  }

  async sendOTPCode(user: User): Promise<[LoginData | null, string, boolean]> {
    const otpCode = randomInt(0, 100000000).toString().padStart(8, '0'); // Generate 8-digit OTP

    const dateCreated = new Date();
    const sessionData: LoginData = { userId: user.user_id, otpCode: otpCode, dateCreated: dateCreated};
    const sessionId = uuidv4();

    // Email content
    const emailSubject = "Your OTP Code for Login for user " + user.username;
    const emailBody = `
      <p>Dear ${user.username},</p>

      <p>
        You have requested to log in to your account. Please use the following One-Time Password (OTP)
        to complete the verification process:
      </p>

      <p><strong>OTP Code:</strong> ${otpCode}</p>

      <p>This code is valid for ${this.loginSessionExpirationMinutes} minutes. Do not share it with anyone.</p>

      <p>If you did not request this, please ignore this email or contact support.</p>
    `;

    try {
      await axios.post(
        `${this.emailServiceUrl}/api/v1/MailService/SendMessage`,
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

      // console.log(`\x1b[34m[MailingService]\x1b[0m Sent OTP email to ${user.email} for user ${user.username}`);
      // console.log(`\x1b[34m[MailingService]\x1b[0m Email content:\nSubject: ${emailSubject}\nBody: ${emailBody}`);
      // console.log(`Generated OTP for user ${user.username} with session id ${sessionId} \nOTP code for this session: ${otpCode}`);

      return [sessionData, sessionId, true];
    } catch (error) {
      this.logger.log(SeverityEnum.ERROR, `Failed to send OTP email: ${error}`);
      return [null, "", false];
    }
  }
}