export interface IHealthChecker {
  isAvailable: boolean;
  checkHealth(): Promise<void>;
}