import { ITokenNamingStrategy } from './ITokenNamingStrategy';

/**
 * Concrete strategy for determining token names based on username
 * This implements special token naming for specific users (e.g., "siem")
 */
export class TokenNamingStrategies implements ITokenNamingStrategy {
  private readonly specialTokenMappings: Map<string, string>;
  private readonly defaultTokenName: string;

  constructor(
    specialTokenMappings: Map<string, string> = new Map([['siem', 'siem-token']]),
    defaultTokenName: string = 'token'
  ) {
    this.specialTokenMappings = specialTokenMappings;
    this.defaultTokenName = defaultTokenName;
  }

  /**
   * Gets the token name for a given username
   * @param username - The username to check
   * @returns Special token name if username matches, otherwise default token name
   */
  getTokenName(username: string): string {
    return this.specialTokenMappings.get(username.toLowerCase()) ?? this.defaultTokenName;
  }

  /**
   * Adds a new special token mapping
   * @param username - The username to map
   * @param tokenName - The token name for this user
   */
  addMapping(username: string, tokenName: string): void {
    this.specialTokenMappings.set(username.toLowerCase(), tokenName);
  }

  /**
   * Removes a special token mapping
   * @param username - The username to remove
   */
  removeMapping(username: string): void {
    this.specialTokenMappings.delete(username.toLowerCase());
  }
}
