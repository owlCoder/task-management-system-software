// Framework
import { Request, Response, Router } from "express";

// Domain
import { IGatewayAuthService } from "../../Domain/services/auth/IGatewayAuthService";
import { LoginUserDTO } from "../../Domain/DTOs/auth/LoginUserDTO";
import { RegistrationUserDTO } from "../../Domain/DTOs/auth/RegistrationUserDTO";
import { BrowserDataDTO } from "../../Domain/DTOs/auth/BrowserDataDTO";
import { AuthResponseType } from "../../Domain/types/auth/AuthResponse";
import { OTPVerificationDTO } from "../../Domain/DTOs/auth/OTPVerificationDTO";

export class GatewayAuthController {
    private readonly router: Router;

    constructor(private readonly gatewayAuthService: IGatewayAuthService){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/login", this.login.bind(this));
        this.router.post("/register", this.register.bind(this));
        this.router.post("/verify-otp", this.verifyOtp.bind(this));
        this.router.post("/resend-otp", this.resendOtp.bind(this));
    }

    /**
     * POST /api/v1/login
     * @param {Request} req - the request object, containing the login data in the body as a {@link LoginUserDTO}.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link AuthResponseType} structure containing the result of the login attempt. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async login(req: Request, res: Response): Promise<void> {
        const data = req.body as LoginUserDTO;

        const result = await this.gatewayAuthService.login(data);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }
    
    /**
     * POST /api/v1/register
     * @param {Request} req - the request object, containing the registration data in the body as a {@link RegistrationUserDTO}. 
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link AuthResponseType} structure containing the result of the registration attempt.
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async register(req: Request, res: Response): Promise<void> {
        const data = req.body as RegistrationUserDTO;

        const result = await this.gatewayAuthService.register(data);
        if(result.success){
            res.status(201).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * POST /api/v1/verify-otp
     * @param {Request} req - the request object, containing the session and otp data in the body as a {@link OTPVerificationDTO}.
     * @param {Response} res the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link AuthResponseType} structure containing the result of the otp verification attempt.
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async verifyOtp(req: Request, res: Response): Promise<void> {
        const browserData = req.body as OTPVerificationDTO;

        const result = await this.gatewayAuthService.verifyOtp(browserData);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * POST /api/v1/resend-otp
     * @param {Request} req - the request object, containing the session data in the body as a {@link BrowserDataDTO}.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link AuthResponseType} structure containing the result of the otp-resend attempt. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async resendOtp(req: Request, res: Response): Promise<void> {
        const browserData = req.body as BrowserDataDTO

        const result = await this.gatewayAuthService.resendOtp(browserData);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    public getRouter(): Router {
        return this.router;
    }
      
}