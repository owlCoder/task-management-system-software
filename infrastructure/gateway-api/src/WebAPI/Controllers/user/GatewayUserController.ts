// Framework
import { Request, Response, Router } from "express";

// Domain
import { IGatewayUserService } from "../../../Domain/services/user/IGatewayUserService";
import { RegistrationUserDTO } from "../../../Domain/DTOs/user/RegistrationUserDTO";
import { UserDTO } from "../../../Domain/DTOs/user/UserDTO";
import { UpdateUserDTO } from "../../../Domain/DTOs/user/UpdateUserDTO";
import { UserRoleDTO } from "../../../Domain/DTOs/user/UserRoleDTO";
import { UserPolicies } from "../../../Domain/access-policies/user/UserPolicies";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";
import { authorize } from "../../../Middlewares/authorization/AuthorizeMiddleware";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";
import { parseOptionalIntArray } from "../../Utils/Query/QueryUtils";

// Infrastructure
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";

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
        const userReadonlyAccess = [authenticate, authorize(...UserPolicies.READONLY)];
        const userWriteAccess = [authenticate, authorize(...UserPolicies.WRITE)];
        const userMultipleReadAccess = [authenticate, authorize(...UserPolicies.READ_MULTIPLE)];

        this.router.get("/users/ids", ...userMultipleReadAccess, this.getUsersByIds.bind(this));
        this.router.post("/users", ...userWriteAccess, this.createUser.bind(this));
        this.router.get("/users/:userId", ...userReadonlyAccess, this.getUserById.bind(this));
        this.router.get("/users", ...userReadonlyAccess, this.getUsers.bind(this));
        this.router.put("/users/:userId", ...userWriteAccess, this.updateUserById.bind(this));
        this.router.delete("/users/:userId", ...userWriteAccess, this.logicallyDeleteUserById.bind(this));
        this.router.get("/user-roles/:impactLevel", ...userReadonlyAccess, this.getRolesByImpactLevel.bind(this));
    }

    /**
     * POST /api/v1/users
     * @param {Request} req - the request object, containing the registration data in the body as a {@link RegistrationUserDTO}.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 201, response data: {@link UserDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async createUser(req: Request, res: Response): Promise<void> {
        if (!req.headers['content-type']?.includes('multipart/form-data')) {
            res.status(400).json({ message: "Bad request - multipart/form-data required" });
            return;
        }

        const result = await this.gatewayUserService.createUser(req);
        handleResponse(res, result, 201);
    }

    /**
     * GET /api/v1/users/:userId
     * @param {Request} req - the request object, containing the user id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link UserDTO}.
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getUserById(req: Request<ReqParams<'userId'>>, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayUserService.getUserById(userId);
        handleResponse(res, result);
    }
    
    /**
     * GET /api/v1/users
     * @param {Request} _req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link UserDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getUsers(_req: Request, res: Response): Promise<void> {
        const result = await this.gatewayUserService.getUsers();
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/users/ids
     * @param {Request} req - the request object, containing the ids in query.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link UserDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getUsersByIds(req: Request, res: Response): Promise<void> {
        const ids = parseOptionalIntArray(req.query.ids);

        const result = await this.gatewayUserService.getUsersByIds(ids);
        handleResponse(res, result);
    }

    /**
     * PUT /api/v1/users/:userId
     * @param {Request} req - the request object, containing the user data in the body as a {@link UpdateUserDTO} and user id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link UserDTO}.
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async updateUserById(req: Request<ReqParams<'userId'>>, res: Response): Promise<void> {
        if(!req.headers['content-type']?.includes('multipart/form-data')){
            res.status(400).json({ message: "Bad request" });
            return;
        }
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayUserService.updateUserById(userId, req);
        handleResponse(res, result);
    }

    /**
     * DELETE /api/v1/users/:userId
     * @param {Request} req - the request object, containing the user id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data.
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async logicallyDeleteUserById(req: Request<ReqParams<'userId'>>, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayUserService.logicallyDeleteUserById(userId);
        handleEmptyResponse(res, result);
    }

    /**
     * GET /api/v1/user-roles/:impactLevel
     * @param {Request} req - the request object.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link UserRoleDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getRolesByImpactLevel(req: Request<ReqParams<'impactLevel'>>, res: Response): Promise<void> {
        const impactLevel = parseInt(req.params.impactLevel, 10);

        const result = await this.gatewayUserService.getRolesByImpactLevel(impactLevel);
        handleResponse(res, result);
    }

    public getRouter(): Router {
        return this.router;
    }

}