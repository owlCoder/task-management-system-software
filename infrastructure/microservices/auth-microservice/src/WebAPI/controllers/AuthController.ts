import { Request, Response, Router } from 'express';
import { ILogerService } from '../../Domain/services/ILogerService';
import { IAuthService } from '../../Domain/services/IAuthService';
import { LoginUserDTO } from '../../Domain/DTOs/LoginUserDTO';
import { SiemLoginUserDTO } from '../../Domain/DTOs/SiemLoginUserDTO';
import { validateLoginData } from '../validators/AuthValidators/LoginValidator';
import { validateSiemLoginData } from '../validators/AuthValidators/SiemLoginValidator';
import { SeverityEnum } from '../../Domain/enums/SeverityEnum';
import { validateOTPResendData } from '../validators/OTPValidators/OtpResendValidator';
import { validateOTPVerificationData } from '../validators/OTPValidators/OtpVerificationValidator';
import { BrowserData } from '../../Domain/models/BrowserData';
import { IOTPVerificationService } from '../../Domain/services/IOTPVerificationService';
import { TokenHelper } from '../../helpers/TokenHelper';
import { ErrorHelper } from '../../helpers/ErrorHelper';
import { ITokenNamingStrategy } from '../../Domain/strategies/ITokenNamingStrategy';
import { JWTTokenService } from '../../Services/JWTTokenServices/JWTTokenService';
import { validateGoogleLoginData } from '../validators/GoogleLoginValidator';
import { GoogleIdTokenVerifier } from '../../Services/Google/GoogleTokenVerifier';


export class AuthController {
  private router: Router;
  private readonly authService: IAuthService;
  private readonly otpVerificationService: IOTPVerificationService;
  private readonly logerService: ILogerService;
  private readonly tokenHelper: TokenHelper;
  private readonly errorHelper: ErrorHelper;

  constructor(
    authService: IAuthService,
    otpVerificationService: IOTPVerificationService,
    logerService: ILogerService,
    tokenNamingStrategy: ITokenNamingStrategy,
    jwtTokenService: JWTTokenService
  ) {
    this.router = Router();
    this.authService = authService;
    this.otpVerificationService = otpVerificationService;
    this.logerService = logerService;
    this.tokenHelper = new TokenHelper(tokenNamingStrategy, jwtTokenService);
    this.errorHelper = new ErrorHelper(logerService);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/auth/login', this.login.bind(this));
    this.router.post('/auth/siem/login', this.siemLogin.bind(this));
    this.router.post('/auth/verify-OTP', this.verifyOTP.bind(this));
    this.router.post('/auth/resend-OTP', this.resendOTP.bind(this));
    this.router.post('/auth/google-login', this.googleLogin.bind(this));
  }

  /**
   * POST /api/v1/auth/login
   * Authenticates a TMSS (Task Management System Software) user
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Object} JSON response with success status, message, and "token" field if authenticated
   * @see {@link LoginUserDTO} for input structure
   */
  private async login(req: Request, res: Response): Promise<void> {
    this.logerService.log(SeverityEnum.INFO, "Login request received");

    const data: LoginUserDTO = req.body as LoginUserDTO;

    // Validate login input
    const validation = validateLoginData(data);
    if (!validation.success) {
      this.errorHelper.handleValidationError(res, validation.message!, "login");
      return;
    }

    this.logerService.log(SeverityEnum.DEBUG, `Login attempt for username: ${data.username}`);

    let result;
    try {
      result = await this.authService.login(data);
    } catch (error) {
      this.errorHelper.handleServerError(res, error, "login");
      return;
    }

    if (result.authenticated) {
      if (result.userData && result.userData.otp_required === true) {
        this.logerService.log(SeverityEnum.INFO, "OTP required for user login");
        const response = this.tokenHelper.createOTPRequiredResponse(result.userData);
        res.status(200).json(response);
      }
      else if (result.userData && result.userData.otp_required === false) {
        try {
          const response = this.tokenHelper.createLoginSuccessResponseWithCustomTokenName(result.userData, "token", "Login successful");
          this.logerService.log(SeverityEnum.INFO, "Login successful with password");
          res.status(200).json(response);
        } catch (error) {
          this.errorHelper.handleJWTError(res, error);
        }
      }
    } else {
      this.errorHelper.handleAuthFailure(res, "Invalid credentials", "login");
    }
  }

  /**
   * POST /api/v1/auth/siem/login
   * Authenticates a SysAdmin user for SIEM (Security Information and Event Management) system access
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Object} JSON response with success status, message, and "siem-token" field
   * @see {@link SiemLoginUserDTO} for input structure
   */
  private async siemLogin(req: Request, res: Response): Promise<void> {
    this.logerService.log(SeverityEnum.INFO, "SIEM login request received");

    const data: SiemLoginUserDTO = req.body as SiemLoginUserDTO;

    // Validate SIEM login input
    const validation = validateSiemLoginData(data);
    if (!validation.success) {
      this.errorHelper.handleValidationError(res, validation.message!, "SIEM login");
      return;
    }

    this.logerService.log(SeverityEnum.DEBUG, `SIEM login attempt for username: ${data.username}`);

    let result;
    try {
      result = await this.authService.siemLogin(data);
    } catch (error) {
      this.errorHelper.handleServerError(res, error, "SIEM login");
      return;
    }

    if (result.authenticated) {
      if (result.userData && result.userData.otp_required === true) {
        this.logerService.log(SeverityEnum.INFO, "SIEM OTP required for user login");
        const response = this.tokenHelper.createOTPRequiredResponse(result.userData, "OTP required to complete SIEM login. Please enter the code sent to your email.");
        res.status(200).json(response);
      }
      else if (result.userData && result.userData.otp_required === false) {
        try {
          const response = this.tokenHelper.createLoginSuccessResponseWithCustomTokenName(result.userData, "siem-token", "SIEM login successful");
          this.logerService.log(SeverityEnum.INFO, "SIEM login successful");
          res.status(200).json(response);
        } catch (error) {
          this.errorHelper.handleJWTError(res, error, "SIEM login");
        }
      }
    } else {
      this.errorHelper.handleAuthFailure(res, "Invalid credentials or insufficient permissions", "SIEM");
    }
  }

  /**
   * POST /api/v1/auth/verify-OTP
   * Verifies the OTP code for login completion
   * @param {number} user_id - The user ID
   * @param {string} session_id - The session ID from login
   * @param {string} otp - The OTP code entered by the user
   * @returns {Object} JSON response with success status, message, and dynamic token field if OTP is valid
   * @see {@link BrowserData} for session data structure
   */
  private async verifyOTP(req: Request, res: Response): Promise<void> {
    this.logerService.log(SeverityEnum.INFO, "OTP verification request received");

    const { user_id, session_id, otp } = req.body;

    const data: BrowserData = { session_id, user_id };

    const validation = validateOTPVerificationData(data, otp);

    if (!validation.success) {
      this.errorHelper.handleValidationError(res, validation.message!, "OTP verification");
      return;
    }

    this.logerService.log(SeverityEnum.DEBUG, `Verifying OTP for user_id: ${user_id}, session_id: ${session_id}`);

    // Call the auth service to verify the OTP
    let result;
    try {
      result = await this.otpVerificationService.verifyOTP(data, otp);
    } catch (error) {
      this.errorHelper.handleServerError(res, error, "OTP verification");
      return;
    }

    if (result.authenticated) {
      try {
        const response = this.tokenHelper.createLoginSuccessResponseFromAuthClaims(result.userData!, "OTP verified successfully");
        this.logerService.log(SeverityEnum.INFO, "OTP verification and login successful");
        res.status(200).json(response);
      } catch (error) {
        this.errorHelper.handleJWTError(res, error);
      }
    } else {
      this.errorHelper.handleAuthFailure(res, "Invalid OTP", "OTP verification");
    }
  }

  /**
   * POST /api/v1/auth/resend-OTP
   * Resends the OTP code for login completion
   * @param {number} user_id - The user ID
   * @param {string} session_id - The session ID from login
   * @returns {Object} JSON response with success status, message, and dynamic token field if mailing service is offline
   * @see {@link BrowserData} for session data structure
   */
  public async resendOTP(req: Request, res: Response): Promise<void> {
    this.logerService.log(SeverityEnum.INFO, "OTP resend request received");

    const { user_id, session_id } = req.body;
    const data: BrowserData = { session_id, user_id };

    const validation = validateOTPResendData(data);
    if (!validation.success) {
      this.errorHelper.handleValidationError(res, validation.message!, "OTP resend");
      return;
    }

    this.logerService.log(SeverityEnum.DEBUG, `Resending OTP for user_id: ${user_id}, session_id: ${session_id}`);

    let result;
    try {
      result = await this.otpVerificationService.resendOTP(data);
    } catch (error) {
      this.errorHelper.handleServerError(res, error, "OTP resend");
      return;
    }

    if (result.authenticated) {
      if (result.userData && result.userData.otp_required === true) {
        this.logerService.log(SeverityEnum.INFO, "OTP resent, user needs to verify");
        const response = this.tokenHelper.createOTPRequiredResponse(result.userData, "OTP has been resent. Please check your email.");
        res.status(200).json(response);
      }
      else if (result.userData && result.userData.otp_required === false) {
        try {
          const response = this.tokenHelper.createLoginSuccessResponseWithCustomTokenName(result.userData, "token", "Mailing service is currently offline. Login successful");
          this.logerService.log(SeverityEnum.INFO, "OTP resend successful, login completed (email offline)");
          res.status(200).json(response);
        } catch (error) {
          this.errorHelper.handleJWTError(res, error);
        }
      }
    } else {
      this.errorHelper.handleAuthFailure(res, "Invalid credentials", "OTP resend");
    }
  }

  private async googleLogin(req: Request, res: Response): Promise<void> {
    this.logerService.log(SeverityEnum.INFO, "Google login request received");

    const validation = validateGoogleLoginData(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, message: validation.message });
      return;
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      res.status(500).json({ success: false, message: "Missing GOOGLE_CLIENT_ID in env." });
      return;
    }

    const { idToken } = req.body as { idToken: string };

    try {
      const verifier = new GoogleIdTokenVerifier(googleClientId);
      const googleUser = await verifier.verify(idToken);

      if (googleUser.email_verified === false) {
        res.status(401).json({ success: false, message: "Google email is not verified." });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Google token verified",
        google: {
          sub: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        },
      });
    } catch (e) {
      res.status(401).json({ success: false, message: "Invalid Google token." });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}