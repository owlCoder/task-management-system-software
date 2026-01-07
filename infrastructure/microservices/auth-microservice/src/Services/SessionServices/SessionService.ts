import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { LoginData } from "../../Domain/models/LoginData";
import { ILogerService } from "../../Domain/services/ILogerService";
import { ISessionStore } from "../../Domain/services/ISessionStore";

export class SessionService implements ISessionStore {
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);
  private readonly logger: ILogerService;
  private readonly sessionStore: Map<string, LoginData> = new Map();

  constructor(logger: ILogerService) {
    this.logger = logger;
    // Move cleanup to a separate scheduler if needed, but for now it can be here so it's easily configurable
    setInterval(() => this.clearExpiredSessions(this.loginSessionExpirationMinutes * 60 * 1000), 60000);
  }

  getSession(sessionId: string): LoginData | undefined {
    // return this.sessionStore.get(sessionId);
    const session = this.sessionStore.get(sessionId);
    // this.logger.log(SeverityEnum.DEBUG, `Session Data for session ${sessionId}: ${JSON.stringify(session)}`);
    return session;
  }

  setSession(sessionId: string, sessionData: LoginData): void {
    // this.logger.log(SeverityEnum.DEBUG, `Setting session for userId ${sessionData.userId} with session ID: ${sessionId} with data: ${JSON.stringify(sessionData)}`);
    this.sessionStore.set(sessionId, sessionData);
  }

  deleteSession(sessionId: string): void {
    // this.logger.log(SeverityEnum.DEBUG, `Deleting session with ID: ${sessionId}`);
    this.sessionStore.delete(sessionId);
  }

  clearExpiredSessions(expirationMs: number): void {
    const now = Date.now();
    const toDelete: string[] = [];
    for (const [sessionId, sessionData] of this.sessionStore) {
      if ((now - sessionData.dateCreated.getTime()) > expirationMs) {
        toDelete.push(sessionId);
      }
    }
    toDelete.forEach(id => this.sessionStore.delete(id));
  }

  validateSession(sessionId: string, userId: number): LoginData | null {
    // this.logger.log(SeverityEnum.DEBUG, `Validating session ID: ${sessionId} for user ID: ${userId}`);
    if (!sessionId) return null;
    const session = this.sessionStore.get(sessionId);
    // this.logger.log(SeverityEnum.DEBUG, `Session Data: ${JSON.stringify(session)}`);
    if (!session) return null;

    const nowMs = Date.now();
    const expired = (nowMs - session.dateCreated.getTime()) > this.loginSessionExpirationMinutes * 60 * 1000;
    // this.logger.log(SeverityEnum.DEBUG, `Session expired: ${expired}`);
    // this.logger.log(SeverityEnum.DEBUG, `${nowMs} - ${session.dateCreated.getTime()} (${nowMs - session.dateCreated.getTime()}) > ${this.loginSessionExpirationMinutes * 60 * 1000}`);

    if (expired || Number(session.userId) !== Number(userId)) {
      this.logger.log(SeverityEnum.WARN, `Session ID: ${sessionId} is invalid or expired for user ID: ${userId} ${session.userId}`);
      this.sessionStore.delete(sessionId);
      return null;
    }

    return session;
  }
}