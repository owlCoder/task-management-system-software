import { LoginTokenClaims } from '../Domain/types/LoginTokenClaims';
import { AuthTokenClaims } from '../Domain/types/AuthTokenClaims';
import { ITokenNamingStrategy } from '../Domain/strategies/ITokenNamingStrategy';
import { TokenAuthResponse, AuthResponse } from '../Domain/types/AuthResponseTypes';
import { IJWTTokenService } from '../Domain/services/IJWTTokenService';

/**
 * Helper class for token response creation
 * Follows Single Responsibility Principle - handles only response creation
 */
export class TokenHelper {
  constructor(
    private readonly tokenNamingStrategy: ITokenNamingStrategy,
    private readonly jwtTokenService: IJWTTokenService
  ) {}

  /**
   * Creates a response object with the appropriate token field name
   * @private - Internal response creation logic
   */
  private createTokenResponse(username: string, token: string, message: string, includeOTPRequired?: boolean): TokenAuthResponse {
    const tokenName = this.tokenNamingStrategy.getTokenName(username);
    const response: any = {
      success: true,
      message,
      otp_required: includeOTPRequired ?? false
    };

    response[tokenName] = token;

    return response as TokenAuthResponse;
  }

  /**
   * Generates a JWT token from LoginTokenClaims
   * Returns empty string if user requires OTP
   */
  /**
   * Creates successful login response with custom token field name
   */
  createLoginSuccessResponseWithCustomTokenName(userData: LoginTokenClaims, tokenName: string = "token", message: string = "Login successful", includeOTPRequired: boolean = true): AuthResponse {
    if (userData.otp_required) {
      return {
        success: false,
        message: "OTP required",
        otp_required: true
      };
    }

    const token = this.jwtTokenService.generateJWTToken(userData);
    const response: any = {
      success: true,
      message,
      otp_required: includeOTPRequired ? userData.otp_required : false
    };

    response[tokenName] = token;

    return response as TokenAuthResponse;
  }

  /**
   * Creates successful login response with token from AuthTokenClaims (used for OTP verification)
   */
  createLoginSuccessResponseFromAuthClaims(userData: AuthTokenClaims, message: string = "Login successful"): AuthResponse {
    const token = this.jwtTokenService.generateTokenFromAuthClaims(userData);
    return this.createTokenResponse(userData.username, token, message);
  }

  /**
   * Creates OTP required response
   * @param userData - User data containing session information
   * @param message - Custom message for the response
   * @returns OTP required response object or error response
   */
  createOTPRequiredResponse(
    userData: LoginTokenClaims,
    message: string = "OTP required to complete login. Please enter the code sent to your email."
  ): AuthResponse {
    if (!userData.otp_required) {
      return {
        success: false,
        message: "OTP not required for this user"
      };
    }

    return {
      success: true,
      otp_required: userData.otp_required,
      session: {
        session_id: userData.session_id,
        user_id: userData.user_id,
        iat: userData.iat,
        exp: userData.exp
      },
      message
    };
  }
  /**
 * Creates successful login response for Google authentication
 */
/**
 * Creates successful login response for Google authentication
 */
createGoogleLoginSuccessResponse(userData: LoginTokenClaims, message: string = "Google login successful"): AuthResponse {
    if (userData.otp_required === false && 'google_id_required' in userData) {
        
        const token = this.jwtTokenService.generateGoogleJWTToken(userData);
        
        const tokenName = this.tokenNamingStrategy.getTokenName(userData.username);
        
        const response: any = {
            success: true,
            message,
            otp_required: false,
            user: {
                email: userData.email,
                image_url: userData.image_url 
            }
        };

        response[tokenName] = token; 

        return response as TokenAuthResponse;
    }

    return {
        success: false,
        message: "Invalid Google token claims provided",
        otp_required: false
    };
  }
}
