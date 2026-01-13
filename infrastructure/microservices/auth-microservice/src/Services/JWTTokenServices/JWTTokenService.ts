import jwt from 'jsonwebtoken';
import { env } from 'process';
import { LoginTokenClaims } from '../../Domain/types/LoginTokenClaims';
import { AuthTokenClaims } from '../../Domain/types/AuthTokenClaims';

/**
 * Service responsible for JWT token generation
 */
export class JWTTokenService {
  private readonly jwtSessionExpiration: number = parseInt(env.JWT_SESSION_EXPIRATION_MINUTES || '30', 10);

  /**
   * Generates a JWT token from user claims
   */
  generateToken(claims: { id: number; username: string; email: string; role: string }): string {
    return jwt.sign(
      claims,
      process.env.JWT_SECRET ?? "",
      { expiresIn: `${this.jwtSessionExpiration}m` }
    );
  }

  /**
   * Generates a JWT token from LoginTokenClaims
   * Returns empty string if user requires OTP
   */
  generateJWTToken(userData: LoginTokenClaims): string {
    if (userData.otp_required) {
      return '';
    }

    return this.generateToken({
      id: userData.user_id,
      username: userData.username,
      email: userData.email,
      role: userData.role
    });
  }

  /**
   * Generates a JWT token from AuthTokenClaims
   */
  generateTokenFromAuthClaims(userData: AuthTokenClaims): string {
    return this.generateToken({
      id: userData.user_id,
      username: userData.username,
      email: userData.email,
      role: userData.role
    });
  }
}