import { ITokenNamingStrategy } from '../Domain/strategies/ITokenNamingStrategy';
import { TokenNamingStrategies } from '../Domain/strategies/TokenNamingStrategies';

/**
 * Factory for creating token naming strategies
 * Follows Factory Pattern and Single Responsibility Principle
 * Encapsulates token naming strategy configuration logic
 */
export class TokenNamingStrategyFactory {
  /**
   * Creates the default token naming strategy for the application
   * Configures special token mappings for specific users
   *
   * @returns Configured token naming strategy
   */
  static createDefaultStrategy(): ITokenNamingStrategy {
    // Special token mappings for specific users
    const specialMappings = new Map<string, string>([
      ['siem', 'siem-token']
    ]);

    // Default token name for all other users (in this case, for tmss => 'token')
    const defaultTokenName = 'token';

    return new TokenNamingStrategies(specialMappings, defaultTokenName);
  }

  /**
   * Creates a custom token naming strategy
   * Useful for testing or different configurations
   *
   * @param specialMappings - Map of username to token name mappings
   * @param defaultTokenName - Default token name for unmapped users
   * @returns Configured token naming strategy
   */
  static createCustomStrategy(
    specialMappings: Map<string, string>,
    defaultTokenName: string = 'token'
  ): ITokenNamingStrategy {
    return new TokenNamingStrategies(specialMappings, defaultTokenName);
  }
}
