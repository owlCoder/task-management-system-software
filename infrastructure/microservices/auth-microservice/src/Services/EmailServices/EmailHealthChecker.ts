import axios from "axios";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IHealthChecker } from "../../Domain/services/IHealthChecker";
import { buildEmailServiceUrl } from "./EmailUrlHelper";

export class EmailHealthChecker implements IHealthChecker {
  private mailingServiceState: boolean = false;
  private readonly emailServiceUrl: string = buildEmailServiceUrl();
  private readonly mailingServiceHealthCheckInterval: number = 60000;
  private readonly logger: ILogerService;

  constructor(logger: ILogerService) {
    this.logger = logger;
    setInterval(() => this.checkHealth(), this.mailingServiceHealthCheckInterval);
    this.checkHealth();
  }

  get isAvailable(): boolean {
    return this.mailingServiceState;
  }

  async checkHealth(): Promise<void> {
    const previousState = this.mailingServiceState;
    try {
      const response = await axios.post(`${this.emailServiceUrl}/MailAlive`, {}, {
        timeout: 2000,
        headers: { 'Content-Type': 'application/json' }
      });
      this.mailingServiceState = response.status === 200;
    } catch (error) {
      this.logger.log(SeverityEnum.ERROR, `Email health check error: ${error}`);
      this.mailingServiceState = false;
    }

    if (this.mailingServiceState !== previousState) {
      if (this.mailingServiceState) {
        this.logger.log(SeverityEnum.INFO, 'Email service connected');
      } else {
        this.logger.log(SeverityEnum.ERROR, 'Email service health check failed');
      }
    }
  }
}