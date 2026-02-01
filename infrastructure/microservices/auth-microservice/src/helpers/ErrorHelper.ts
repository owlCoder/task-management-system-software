import { Response } from 'express';
import { ILogerService } from '../Domain/services/ILogerService';
import { SeverityEnum } from '../Domain/enums/SeverityEnum';

/**
 * Helper class for error handling and response creation
 * Follows Single Responsibility Principle - handles only error operations
 */
export class ErrorHelper {
  constructor(private readonly logger: ILogerService) {}

  /**
   * Handles validation errors with logging and response
   * @param res - Express response object
   * @param message - Error message
   * @param context - Context where the error occurred
   */
  handleValidationError(res: Response, message: string, context: string): void {
    this.logger.log(SeverityEnum.WARN, `${context} validation failed: ${message}`);
    res.status(400).json({ success: false, message });
  }

  /**
   * Handles server errors with logging and response
   * @param res - Express response object
   * @param error - Error object or message
   * @param context - Context where the error occurred
   */
  handleServerError(res: Response, error: unknown, context: string): void {
    this.logger.log(SeverityEnum.ERROR, `${context} error: ${error}`);
    res.status(500).json({ success: false, message: "Server error" });
  }

  /**
   * Handles JWT generation errors with logging and response
   * @param res - Express response object
   * @param error - Error object or message
   * @param context - Optional context for the error
   */
  handleJWTError(res: Response, error: unknown, context: string = ""): void {
    this.logger.log(SeverityEnum.ERROR, `JWT generation error${context ? ` for ${context}` : ''}: ${error}`);
    res.status(500).json({ success: false, message: "Server error" });
  }

  /**
   * Handles authentication failures with logging and response
   * @param res - Express response object
   * @param message - Error message
   * @param context - Context where the authentication failed
   */
  handleAuthFailure(res: Response, message: string, context: string): void {
    this.logger.log(SeverityEnum.WARN, `${context} authentication failed: ${message}`);
    res.status(401).json({ success: false, message });
  }
}
