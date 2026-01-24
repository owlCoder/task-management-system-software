import { LoginTokenClaims } from '../types/LoginTokenClaims';
import { AuthTokenClaims } from '../types/AuthTokenClaims';

export interface IJWTTokenService {
  generateToken(claims: { id: number; username?: string; email: string; role: string, image_url?: string }): string;
  generateJWTToken(userData: LoginTokenClaims): string;
  generateTokenFromAuthClaims(userData: AuthTokenClaims): string;
  generateGoogleJWTToken(userData: LoginTokenClaims): string;
}