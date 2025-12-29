import { LoginData } from "../models/LoginData";

export interface ISessionStore {
  getSession(sessionId: string): LoginData | undefined;
  setSession(sessionId: string, sessionData: LoginData): void;
  deleteSession(sessionId: string): void;
  clearExpiredSessions(expirationMs: number): void;
  validateSession(sessionId: string, userId: number, expirationMs: number): LoginData | null;
}