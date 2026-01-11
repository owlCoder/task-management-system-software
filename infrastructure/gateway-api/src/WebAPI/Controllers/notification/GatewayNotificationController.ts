// Framework
import { Router, Request, Response } from "express";

// Domain
import { IGatewayNotificationService } from "../../../Domain/services/notification/IGatewayNotificationService";
import { NotificationDTO } from "../../../Domain/DTOs/notification/NotificationDTO";
import { NotificationCreateDTO } from "../../../Domain/DTOs/notification/NotificationCreateDTO";

// Middlewares
import { authenticate } from "../../../Middlewares/authentication/AuthMiddleware";

// Utils
import { handleEmptyResponse, handleResponse } from "../../Utils/Http/ResponseHandler";

// Infrastructure
import { ReqParams } from "../../../Infrastructure/express/types/ReqParams";

/**
 * Routes client requests towards the Notification Microservice.
 */
export class GatewayNotificationController {
    private readonly router: Router;

    constructor(private gatewayNotificationService: IGatewayNotificationService) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Registering routes for Notification Microservice.
     */
    private initializeRoutes(){
        this.router.get("/notifications/:notificationId", authenticate, this.getNotificationById.bind(this));
        this.router.get("/notifications/user/:userId", authenticate, this.getNotificationsByUserId.bind(this));
        this.router.get("/notifications/user/:userId/unread-count", authenticate, this.getUnreadNotificationCount.bind(this));
        this.router.post("/notifications", authenticate, this.createNotification.bind(this));
        this.router.patch("/notifications/bulk/unread", authenticate, this.markMultipleNotificationsAsUnread.bind(this));
        this.router.patch("/notifications/bulk/read", authenticate, this.markMultipleNotificationsAsRead.bind(this));
        this.router.patch("/notifications/:notificationId/read", authenticate, this.markNotificationAsRead.bind(this));
        this.router.patch("/notifications/:notificationId/unread", authenticate, this.markNotificationAsUnread.bind(this));
        this.router.delete("/notifications/bulk", authenticate, this.deleteMultipleNotifications.bind(this));
        this.router.delete("/notifications/:notificationId", authenticate, this.deleteNotification.bind(this));
    }

    /**
     * GET /api/v1/notifications/:notificationId
     * @param {Request} req - the request object, containing the notification id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link NotificationDTO}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getNotificationById(req: Request<ReqParams<'notificationId'>>, res: Response): Promise<void> {
        const notificationId = parseInt(req.params.notificationId, 10);

        const result = await this.gatewayNotificationService.getNotificationById(notificationId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/notifications/user/:userId
     * @param {Request} req - the request object, containing the user id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: {@link NotificationDTO[]}. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getNotificationsByUserId(req: Request<ReqParams<'userId'>>, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayNotificationService.getNotificationsByUserId(userId);
        handleResponse(res, result);
    }

    /**
     * GET /api/v1/notifications/user/:userId/unread-count
     * @param {Request} req - the request object, containing the user id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 200, response data: number of unread notifications. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async getUnreadNotificationCount(req: Request<ReqParams<'userId'>>, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId, 10);

        const result = await this.gatewayNotificationService.getUnreadNotificationCount(userId);
        handleResponse(res, result);
    }

    /**
     * POST /api/v1/notifications
     * @param {Request} req - the request object, containing the notification data as {@link NotificationCreateDTO} in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async createNotification(req: Request, res: Response): Promise<void> {
        const data = req.body as NotificationCreateDTO;

        const result = await this.gatewayNotificationService.createNotification(data);
        handleEmptyResponse(res, result);
    }

    /**
     * PATCH /api/v1/notifications/bulk/read
     * @param {Request} req - the request object, containing the notification ids in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async markMultipleNotificationsAsRead(req: Request, res: Response): Promise<void> {
        const notificationIds = req.body as number[];

        const result = await this.gatewayNotificationService.markMultipleNotificationsAsRead(notificationIds);
        handleEmptyResponse(res, result);
    }

    /**
     * PATCH /api/v1/notifications/bulk/unread
     * @param {Request} req - the request object, containing the notification ids in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async markMultipleNotificationsAsUnread(req: Request, res: Response): Promise<void> {
        const notificationIds = req.body as number[];

        const result = await this.gatewayNotificationService.markMultipleNotificationsAsUnread(notificationIds);
        handleEmptyResponse(res, result);
    }

    /**
     * PATCH /api/v1/notifications/:notificationId/read
     * @param {Request} req - the request object, containing the notification id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async markNotificationAsRead(req: Request<ReqParams<'notificationId'>>, res: Response): Promise<void> {
        const notificationId = parseInt(req.params.notificationId, 10);
        
        const result = await this.gatewayNotificationService.markNotificationAsRead(notificationId);
        handleEmptyResponse(res, result);
    }

    /**
     * PATCH /api/v1/notifications/:notificationId/unread
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async markNotificationAsUnread(req: Request<ReqParams<'notificationId'>>, res: Response): Promise<void> {
        const notificationId = parseInt(req.params.notificationId, 10);

        const result = await this.gatewayNotificationService.markNotificationAsUnread(notificationId);
        handleEmptyResponse(res, result);
    }

    /**
     * DELETE /api/v1/notifications/bulk
     * @param {Request} req - the request object, containing the notification ids in body.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async deleteMultipleNotifications(req: Request, res: Response): Promise<void> {
        const notificationIds = req.body as number[];

        const result = await this.gatewayNotificationService.deleteMultipleNotifications(notificationIds);
        handleEmptyResponse(res, result);
    }

    /**
     * DELETE /api/v1/notifications/:notificationId
     * @param {Request} req - the request object, containing the notification id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Promise<void>}
     * - On success: response status 204, no data. 
     * - On failure: response status code indicating the failure, response data: message describing the error.
     */
    private async deleteNotification(req: Request<ReqParams<'notificationId'>>, res: Response): Promise<void> {
        const notificationId = parseInt(req.params.notificationId, 10);

        const result = await this.gatewayNotificationService.deleteNotification(notificationId);
        handleEmptyResponse(res, result);
    }

    public getRouter() {
        return this.router;
    }
}