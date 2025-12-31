// Framework
import { Request, Response, Router } from "express";

// Domain
import { IGatewayUserService } from "../../../Domain/services/user/IGatewayUserService";
import { RegistrationUserDTO } from "../../../Domain/DTOs/user/RegistrationUserDTO";
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

    /**
     * Registering routes for User Microservice.
     */
    private initializeRoutes() {
        const userAccess = [authenticate, authorize(UserRole.ADMIN)];

        this.router.post("/users", ...userAccess, this.createUser.bind(this));
        this.router.get("/users/:userId", ...userAccess, this.getUserById.bind(this));
        this.router.get("/users", ...userAccess, this.getUsers.bind(this));
        this.router.put("/users/:userId", ...userAccess, this.updateUserById.bind(this));
        this.router.delete("/users/:userId", ...userAccess, this.logicallyDeleteUserById.bind(this));
        this.router.get("/user-roles/userCreation", ...userAccess, this.getCreationRoles.bind(this));
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
     * GET /api/v1/users/:userId
     * @param {Request} req - the request object, containing the user id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link UserDTO} structure containing the result of the get user by id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getUserById(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayUserService.getUserById(userId);
        handleResponse(res, result);
    }
    
    /**
     * GET /api/v1/users
     * @param {Request} _req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the structure {@link UserDTO[]} containing the result of the get users operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getUsers(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayUserService.getUsers();
        handleResponse(res, result);
    }

    /**
     * PUT /api/v1/users/:userId
     * @param {Request} req - the request object, containing the user data in the body as a {@link UpdateUserDTO} and user id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link UserDTO} structure containing the result of the update operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async updateUserById(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);
        const data = req.body as UpdateUserDTO;

        const result = await this.gatewayUserService.updateUserById(userId, data);
        handleResponse(res, result);
    }

    /**
     * DELETE /api/v1/users/:userId
     * @param {Request} req - the request object, containing the user id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async logicallyDeleteUserById(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayUserService.logicallyDeleteUserById(userId);
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