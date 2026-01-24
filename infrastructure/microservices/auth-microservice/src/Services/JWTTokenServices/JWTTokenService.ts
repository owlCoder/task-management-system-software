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
  generateToken(claims: { id: number; username?: string; email: string; role: string, image_url?: string }): string {
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

    console.log('userData.image_url:', userData.image_url);
console.log('userData:', userData);
    return this.generateToken({
      id: userData.user_id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      image_url: userData.image_url
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
      role: userData.role,
      image_url: userData.image_url
    });
  }
  /**
   * Generates a JWT token for Google authenticated users
   */
  generateGoogleJWTToken(userData: LoginTokenClaims): string {
    // We use email as username 
    if(userData.google_id_required)
    {
      return this.generateToken({
        id: userData.user_id,
        username: userData.email, 
        email: userData.email,
        role: userData.role,
        image_url: userData.image_url
      });
    }
    else
      return '';
  }
}

