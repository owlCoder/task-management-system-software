import { Request, Response, Router } from "express";
import { LoginUserDTO } from "../Domain/DTOs/LoginUserDTO";
import { IGatewayAuthService } from "../Domain/services/IGatewayAuthService";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { BrowserDataDTO } from "../Domain/DTOs/BrowserDataDTO";

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
    }

    private async login(req: Request, res: Response): Promise<void> {
        const data: LoginUserDTO = req.body;
        const result = await this.gatewayAuthService.login(data);
        if(result.success){
            res.status(200).json(result.data);
        }
        else{
            res.status(result.status).json({ message: result.message });
        }
    }
    
    private async register(req: Request, res: Response): Promise<void> {
        const data: RegistrationUserDTO = req.body;
        const result = await this.gatewayAuthService.register(data);
        if(result.success){
            res.status(201).json(result.data);
        }
        else{
            res.status(result.status).json({ message: result.message });
        }
    }

    private async verifyOtp(req: Request, res: Response): Promise<void> {
        const browserData: BrowserDataDTO = req.body;
        const result = await this.gatewayAuthService.verifyOtp(browserData);
        if(result.success){
            res.status(200).json(result.data);
        }
        else{
            res.status(result.status).json({ message: result.message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
      
}