// Framework
import { Request, Response, Router } from "express";

// Domain
import { IGatewayUserService } from "../../../Domain/services/user/IGatewayUserService";
import { RegistrationUserDTO } from "../../../Domain/DTOs/auth/RegistrationUserDTO";
import { UserDTO } from "../../../Domain/DTOs/user/UserDTO";
import { UpdateUserDTO } from "../../../Domain/DTOs/user/UpdateUserDTO";
import { UserRoleDTO } from "../../../Domain/DTOs/user/UserRoleDTO";
import { UserRole } from "../../../Domain/enums/user/UserRole";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";

/**
 * Routes client requests towards the User Microservice.
 */
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
        this.router.get("/user-roles/userCreation", authenticate, authorize(UserRole.ADMIN), this.getCreationRoles.bind(this));
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
        handleResponse(res, result, 201);
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
        handleResponse(res, result);
    }
    
    /**
     * GET /api/v1/users
     * @param {Request} req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the structure {@link UserDTO[]} containing the result of the get users operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getUsers(req: Request, res: Response): Promise<void> {
        const result = await this.gatewayUserService.getUsers();
        handleResponse(res, result);
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
        handleResponse(res, result);
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
        handleEmptyResponse(res, result);
    }

    /**
     * GET /api/v1/user-roles/userCreation
     * @param {Request} _req - the request object, unused.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the structure {@link UserRoleDTO[]} containing the result of the get creation roles operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getCreationRoles(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayUserService.getCreationRoles();
        handleResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }

}