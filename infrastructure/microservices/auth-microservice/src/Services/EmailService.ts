import axios from "axios";
import { User } from "../Domain/models/User";
import { LoginData } from "../Domain/models/LoginData";
import { v4 as uuidv4 } from 'uuid';
import { randomInt } from "crypto";

export class EmailService {
  private readonly emailServiceUrl: string = `${process.env.MAIL_SERVICE_HOST || 'http://localhost'}:${process.env.MAIL_SERVICE_PORT || '6245'}`;
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);
  private readonly mailingServiceHealthCheckInterval: number = 60000;
  private mailingServiceState: boolean = false;

  constructor() {
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
      console.log('\x1b[34m[MailingService]\x1b[0m Email service connected');
      this.mailingServiceState = response.status === 200;
    } catch (error) {
      console.log(`\x1b[31m[MailingService]\x1b[0m Email service is currently unavailable, retrying the connection in ${this.mailingServiceHealthCheckInterval / 1000}s.`);
      this.mailingServiceState = false;
    }
  }

  async sendOTPCode(user: User): Promise<[LoginData | null, string, boolean]> {
    const otpCode = randomInt(0, 100000000).toString().padStart(8, '0'); // Generate 8-digit OTP

    const dateCreated = new Date();
    const sessionData: LoginData = { userId: user.user_id, otpCode: otpCode, dateCreated: dateCreated, retryCount: 0 };
    const sessionId = uuidv4();

    // Email content
    const emailSubject = "Your OTP Code for Login";
    const emailBody = `
      Dear ${user.username},

      You have requested to log in to your account. Please use the following One-Time Password (OTP) to complete the verification process:

      OTP Code: ${otpCode}

      This code is valid for ${this.loginSessionExpirationMinutes} minutes. Do not share it with anyone.

      If you did not request this, please ignore this email or contact support.
    `;

    try {
      await axios.post(`${this.emailServiceUrl}/send-email`, {
        email: user.email,
        emailSubject: emailSubject,
        emailBody: emailBody
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });

      // console.log(`Generated OTP for user ${user.username} with session id ${sessionId} \nOTP code for this session: ${otpCode}`);
      return [sessionData, sessionId, true];
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return [null, "", false];
    }
  }
}