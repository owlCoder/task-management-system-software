// Framework
import { Request, Response, Router } from "express";

// Domain
import { IGatewayAuthService } from "../../../Domain/services/auth/IGatewayAuthService";
import { LoginUserDTO } from "../../../Domain/DTOs/auth/LoginUserDTO";
import { BrowserDataDTO } from "../../../Domain/DTOs/auth/BrowserDataDTO";
import { AuthResponseType } from "../../../Domain/types/auth/AuthResponse";
import { OTPVerificationDTO } from "../../../Domain/DTOs/auth/OTPVerificationDTO";

// Utils
import { handleResponse } from "../../Utils/Http/ResponseHandler";

/**
 * Routes client requests towards the Auth Microservice.
 */
export class GatewayAuthController {
    private readonly router: Router;

    constructor(private readonly gatewayAuthService: IGatewayAuthService){
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for Auth Microservice.
     */
    private initializeRoutes(): void {
        this.router.post("/login", this.login.bind(this));
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
        handleResponse(res, result);
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
        const data = req.body as OTPVerificationDTO;

        const result = await this.gatewayAuthService.verifyOtp(data);
        handleResponse(res, result);
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
        const data = req.body as BrowserDataDTO

        const result = await this.gatewayAuthService.resendOtp(data);
        handleResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }
      
}