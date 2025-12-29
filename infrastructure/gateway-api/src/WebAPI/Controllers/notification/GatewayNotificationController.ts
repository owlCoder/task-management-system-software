// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayNotificationService } from "../../../Domain/services/notification/IGatewayNotificationService";
import { NotificationDTO } from "../../../Domain/DTOs/notification/NotificationDTO";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";

/**
 * Routes client requests towards the Notification Microservice.
 */
export class GatewayNotificationController {
    private readonly router: Router;

    constructor(private gatewayNotificationService: IGatewayNotificationService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get("/notifications/:id", authenticate, this.getNotificationById.bind(this));
        this.router.get("/notifications/user/:userId", authenticate, this.getNotificationsByUserId.bind(this));
        this.router.get("/notifications/user/:userId/unread-count", authenticate, this.getUnreadNotificationCount.bind(this));
        this.router.patch("/notifications/bulk/unread", authenticate, this.markMultipleNotificationsAsUnread.bind(this));
        this.router.patch("/notifications/bulk/read", authenticate, this.markMultipleNotificationsAsRead.bind(this));
        this.router.patch("/notifications/:id/read", authenticate, this.markNotificationAsRead.bind(this));
        this.router.patch("/notifications/:id/unread", authenticate, this.markNotificationAsUnread.bind(this));
        this.router.delete("/notifications/bulk", authenticate, this.deleteMultipleNotifications.bind(this));
        this.router.delete("/notifications/:id", authenticate, this.deleteNotification.bind(this));
    }

    /**
     * GET /api/v1/notifications/:id
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link NotificationDTO} structure containing the result of the get notification by id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getNotificationById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);

        const result = await this.gatewayNotificationService.getNotificationById(id);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/notifications/user/:userId
     * @param {Request} req - the request object, containing the userId in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link NotificationDTO[]} structure containing the result of the get notification by user id operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getNotificationsByUserId(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId);

        const result = await this.gatewayNotificationService.getNotificationsByUserId(userId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/notifications/user/:userId/unread-count
     * @param {Request} req - the request object, containing the userId in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object containing the number of unread notifications for user with userId. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async getUnreadNotificationCount(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId);

        const result = await this.gatewayNotificationService.getUnreadNotificationCount(userId);
        handleResponse(res, result);
    }

    /**
     * PATCH /api/v1/notifications/bulk/read
     * @param {Request} req - the request object, containing the ids in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content.
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async markMultipleNotificationsAsRead(req: Request, res: Response): Promise<void> {
        const ids = req.body as number[];

        const result = await this.gatewayNotificationService.markMultipleNotificationsAsRead(ids);
        handleEmptyResponse(res, result);
    }

    /**
     * PATCH /api/v1/notifications/bulk/unread
     * @param {Request} req - the request object, containing the ids in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async markMultipleNotificationsAsUnread(req: Request, res: Response): Promise<void> {
        const ids = req.body as number[];

        const result = await this.gatewayNotificationService.markMultipleNotificationsAsUnread(ids);
        handleEmptyResponse(res, result);
    }

    /**
     * PATCH /api/v1/notifications/:id/read
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content.
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async markNotificationAsRead(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        
        const result = await this.gatewayNotificationService.markNotificationAsRead(id);
        handleEmptyResponse(res, result);
    }

    /**
     * PATCH /api/v1/notifications/:id/unread
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content.
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async markNotificationAsUnread(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);

        const result = await this.gatewayNotificationService.markNotificationAsUnread(id);
        handleEmptyResponse(res, result);
    }

    /**
     * DELETE /api/v1/notifications/bulk
     * @param {Request} req - the request object, containing the ids in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async deleteMultipleNotifications(req: Request, res: Response): Promise<void> {
        const ids = req.body as number[];

        const result = await this.gatewayNotificationService.deleteMultipleNotifications(ids);
        handleEmptyResponse(res, result);
    }

    /**
     * DELETE /api/v1/notifications/:id
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: 204 No Content. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async deleteNotification(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);

        const result = await this.gatewayNotificationService.deleteNotification(id);
        handleEmptyResponse(res, result);
    }

    public getRouter() {
        return this.router;
    }
}