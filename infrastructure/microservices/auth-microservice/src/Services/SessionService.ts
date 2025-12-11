import { LoginData } from "../Domain/models/LoginData";
import { ILogerService } from "../Domain/services/ILogerService";

export class SessionService {
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);
  private SessionStore: Map<string, LoginData> = new Map();
  private readonly logger: ILogerService;

  constructor(logger: ILogerService) {
    this.logger = logger;
    // Start background task to clear expired sessions
    setInterval(() => this.clearExpiredSessions(), 60000);
  }

  getSession(sessionId: string): LoginData | undefined {
    return this.SessionStore.get(sessionId);
  }

  setSession(sessionId: string, sessionData: LoginData): void {
    this.SessionStore.set(sessionId, sessionData);
  }

  deleteSession(sessionId: string): void {
    this.SessionStore.delete(sessionId);
  }

  private clearExpiredSessions(): void {
    const now = Date.now();
    const expirationMs = this.loginSessionExpirationMinutes * 60 * 1000;
    const toDelete: string[] = [];
    for (const [sessionId, sessionData] of this.SessionStore) {
      if ((now - sessionData.dateCreated.getTime()) > expirationMs) {
        toDelete.push(sessionId);
      }
    }
    toDelete.forEach(id => this.SessionStore.delete(id));
  }
}