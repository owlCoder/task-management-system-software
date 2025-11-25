import { Request, Response, Router } from "express";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { IGatewayUserService } from "../Domain/services/IGatewayUserService";
import { authenticate } from "../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../Domain/enums/UserRole";

export class GatewayUserController {
    private readonly router: Router;

    constructor(private readonly gatewayUserService : IGatewayUserService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/users", authenticate, authorize(UserRole.Admin), this.createUser.bind(this));
        this.router.get("/users/:id", authenticate, authorize(UserRole.Admin), this.getUserById.bind(this));
        this.router.get("/users", authenticate, authorize(UserRole.Admin), this.getUsers.bind(this));
    }

    private async createUser(req: Request, res: Response): Promise<void> {
        const data: RegistrationUserDTO = req.body as RegistrationUserDTO;
        const result = await this.gatewayUserService.createUser(data);
        if(result.success){
            res.status(201).json(result.data);
        }
        else{
            res.status(result.status).json({ success: false, message: result.message });
        }
    }

    private async getUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const result = await this.gatewayUserService.getUserById(id);
        if(result.success){
            res.status(200).json(result.data);
        }
        else{
            res.status(result.status).json({ success: false, message: result.message })
        }
    }

    private async getUsers(req: Request, res: Response): Promise<void> {
        const result = await this.gatewayUserService.getUsers();
        if(result.success){
            res.status(200).json(result.data);
        }
        else {
            res.status(result.status).json({ success: false, message: result.message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }

}