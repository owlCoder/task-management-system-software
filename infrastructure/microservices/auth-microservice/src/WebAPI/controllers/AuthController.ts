import { Request, Response, Router } from 'express';
import jwt from "jsonwebtoken";
import { IAuthService } from '../../Domain/services/IAuthService';
import { LoginUserDTO } from '../../Domain/DTOs/LoginUserDTO';
import { validateLoginData } from '../validators/LoginValidator';
import { ILogerService } from '../../Domain/services/ILogerService';
import { SeverityEnum } from '../../Domain/enums/SeverityEnum';
import { validateOTPVerificationData } from '../validators/OtpValidator';
import { env } from 'process';
import { BrowserData } from '../../Domain/models/BrowserData';
import { IOTPVerificationService } from '../../Domain/services/IOTPVerificationService';

export class AuthController {
  private router: Router;
  private authService: IAuthService;
  private otpVerificationService: IOTPVerificationService;
  private readonly logerService: ILogerService;
  private readonly jwtSessionExpiration: number = parseInt(env.JWT_SESSION_EXPIRATION_MINUTES || '30', 10);

  constructor(authService: IAuthService, otpVerificationService: IOTPVerificationService, logerService: ILogerService) {
    this.router = Router();
    this.authService = authService;
    this.otpVerificationService = otpVerificationService;
    this.logerService = logerService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/auth/login', this.login.bind(this));
    this.router.post('/auth/verify-OTP', this.verifyOTP.bind(this));
    this.router.post('/auth/resend-OTP', this.resendOTP.bind(this));
  }

  /**
   * POST /api/v1/auth/login
   * Authenticates a user
   * @param {LoginUserDTO} req.body - The login data from the request body
   * @returns {Object} JSON response with success status, session/token, and message
   * @see {@link LoginUserDTO} for input structure
   */
  private async login(req: Request, res: Response): Promise<void> {
    this.logerService.log(SeverityEnum.INFO, "Login request received");
    console.log("Login request received");

    const data: LoginUserDTO = req.body as LoginUserDTO;

    // Validate login input
    const validation = validateLoginData(data);
    if (!validation.success) {
      res.status(400).json({ success: false, message: validation.message });
      return;
    }

    console.log(`Login attempt for username: ${data.username}`);

    let result;
    try {
      result = await this.authService.login(data);
    } catch (error) {
      this.logerService.log(SeverityEnum.ERROR, error as string)
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }

    if (result.authenticated) {
      if (result.userData && result.userData.otp_required === true) {
        res.status(200).json({
          success: true,
          otp_required: result.userData.otp_required,
          session: {
            session_id: result.userData?.session_id,
            user_id: result.userData?.user_id,
            iat: result.userData?.iat,
            exp: result.userData?.exp
          },
          message: "OTP required to complete login. Please enter the code sent to your email."
        });
      }
      else if (result.userData && result.userData.otp_required === false) {
        try {
          const token = jwt.sign(
            { id: result.userData?.user_id, username: result.userData?.username, email: result.userData?.email, role: result.userData?.role },
            process.env.JWT_SECRET ?? "",
            { expiresIn: `${this.jwtSessionExpiration}m` }
          );

          res.status(200).json({
            success: true,
            otp_required: result.userData.otp_required,
            message: "Login successful",
            token
          });
        } catch (error) {
          this.logerService.log(SeverityEnum.ERROR, error as string)
          res.status(500).json({ success: false, message: "Server error" });
        }
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials!" });
    }
  }

  /**
   * POST /api/v1/auth/verify-OTP
   * Verifies the OTP code for login completion
   * @param {number} req.body.user_id - The user ID
   * @param {string} req.body.session_id - The session ID from login
   * @param {string} req.body.otp - The OTP code entered by the user
   * @returns {Object} JSON response with success status, token, and message
   * @see {@link BrowserData} for session data structure
   */
  private async verifyOTP(req: Request, res: Response): Promise<void> {
    this.logerService.log(SeverityEnum.INFO, "OTP verification request received");

    const { user_id, session_id, otp } = req.body;

    const data: BrowserData = { session_id, user_id };

    const validation = validateOTPVerificationData(data, otp);

    if (!validation.success) {
      res.status(400).json({ success: false, message: validation.message });
      return;
    }

    // Call the auth service to verify the OTP
    let result;
    try {
      result = await this.otpVerificationService.verifyOTP(data, otp);
    } catch (error) {
      this.logerService.log(SeverityEnum.ERROR, error as string)
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
    if (result.authenticated) {
      try {
        const token = jwt.sign(
          { id: result.userData?.user_id, username: result.userData?.username, email: result.userData?.email, role: result.userData?.role },
          process.env.JWT_SECRET ?? "",
          { expiresIn: `${this.jwtSessionExpiration}m` }
        );

        res.status(200).json({ success: true, message: "OTP verified successfully", token });
      } catch (error) {
        this.logerService.log(SeverityEnum.ERROR, error as string)
        res.status(500).json({ success: false, message: "Server error" });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  }

  public async resendOTP(req: Request, res: Response): Promise<void> {
    this.logerService.log(SeverityEnum.INFO, "OTP resend request received");
    const { user_id, session_id } = req.body;
    const data: BrowserData = { session_id, user_id };
    // if (!validation.success) {
    //   res.status(400).json({ success: false, message: validation.message });
    //   return;
    // }
    let result;
    try {
      result = await this.otpVerificationService.resendOTP(data);
    } catch (error) {
      this.logerService.log(SeverityEnum.ERROR, error as string)
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
    if (result.authenticated) {
      if (result.userData && result.userData.otp_required === true) {
        res.status(200).json({
          success: true,
          otp_required: result.userData.otp_required,
          session: {
            session_id: result.userData?.session_id,
            user_id: result.userData?.user_id,
            iat: result.userData?.iat,
            exp: result.userData?.exp
          },
          message: "OTP has been resent. Please check your email."
        });
      }
      else if (result.userData && result.userData.otp_required === false) {
        try {
          const token = jwt.sign(
            { id: result.userData?.user_id, username: result.userData?.username, email: result.userData?.email, role: result.userData?.role },
            process.env.JWT_SECRET ?? "",
            { expiresIn: `${this.jwtSessionExpiration}m` }
          );

          res.status(200).json({
            success: true,
            otp_required: result.userData.otp_required,
            message: "Mailing service is currently offline. Login successful",
            token
          });
        } catch (error) {
          this.logerService.log(SeverityEnum.ERROR, error as string)
          res.status(500).json({ success: false, message: "Server error" });
        }
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials!" });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}