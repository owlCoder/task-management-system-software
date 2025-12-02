import { Request, Response, Router } from "express";
import { RegistrationUserDTO } from "../../Domain/DTOs/auth/RegistrationUserDTO";
import { IGatewayUserService } from "../../Domain/services/user/IGatewayUserService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { UserDTO } from "../../Domain/DTOs/user/UserDTO";
import { UpdateUserDTO } from "../../Domain/DTOs/user/UpdateUserDTO";

export class GatewayUserController {
    private readonly router: Router;

    constructor(private readonly gatewayUserService : IGatewayUserService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/users", authenticate, authorize(UserRole.ADMIN), this.createUser.bind(this));
        this.router.get("/users/:id", authenticate, authorize(UserRole.ADMIN), this.getUserById.bind(this));
        this.router.get("/users", authenticate, authorize(UserRole.ADMIN), this.getUsers.bind(this));
        this.router.put("/users/:id", authenticate, authorize(UserRole.ADMIN), this.updateUserById.bind(this));
        this.router.delete("/users/:id", authenticate, authorize(UserRole.ADMIN), this.logicallyDeleteUserById.bind(this));
    }

    /**
     * POST /api/v1/users
     * @param {Request} req - the request object, containing the registration data in the body as a {@link RegistrationUserDTO}.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link UserDTO} structure containing the result of the registration attempt. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async createUser(req: Request, res: Response): Promise<void> {
        const data = req.body as RegistrationUserDTO;

        const result = await this.gatewayUserService.createUser(data);
        if(result.success){
            res.status(201).json(result.data);
            return;
        }
        res.status(result.status).json({ success: false, message: result.message });
    }

    /**
     * GET /api/v1/users/:id
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link UserDTO} structure containing the result of the get user by id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);

        const result = await this.gatewayUserService.getUserById(id);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ success: false, message: result.message })
    }
    
    /**
     * GET /api/v1/users
     * @param {Request} req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the list of {@link UserDTO} structure containing the result of the get users operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getUsers(req: Request, res: Response): Promise<void> {
        const result = await this.gatewayUserService.getUsers();
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ success: false, message: result.message });
    }

    /**
     * PUT /api/v1/users/:id
     * @param {Request} req - the request object, containing the user data in the body as a {@link UpdateUserDTO} and id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link UserDTO} structure containing the result of the update operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async updateUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const data = req.body as UpdateUserDTO;

        const result = await this.gatewayUserService.updateUserById(id, data);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ success: false, message: result.message });
    }

    /**
     * DELETE /api/v1/users/:id
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async logicallyDeleteUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);

        const result = await this.gatewayUserService.logicallyDeleteUserById(id);
        if(result.success){
            res.status(204).send();
            return;
        }
        res.status(result.status).json({ success: false, message: result.message });
    }

    public getRouter(): Router {
        return this.router;
    }

}