/**
 * Strategy interface for determining token names based on user context
 * Follows the Strategy Pattern from SOLID principles
 */
export interface ITokenNamingStrategy {
  /**
   * Determines the token field name for a given username
   * @param username - The username to check
   * @returns The token field name (e.g., "token", "siem-token")
   */
  getTokenName(username: string): string;
}
