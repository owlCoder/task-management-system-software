import { Router, Request, Response } from "express";
import { IGatewayNotificationService } from "../../Domain/services/notification/IGatewayNotificationService";
import { NotificationDTO } from "../../Domain/DTOs/notification/NotificationDTO";

export class GatewayNotificationController {
    private readonly router: Router;

    constructor(private notificationService: IGatewayNotificationService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get("/notifications/:id", this.getNotificationById.bind(this));
        this.router.get("/notifications/user/:userId", this.getNotificationsByUserId.bind(this));
        this.router.get("/notifications/user/:userId/unread-count", this.getUnreadNotificationCount.bind(this));
        this.router.patch("/notifications/bulk/unread", this.markMultipleNotificationsAsUnread.bind(this));
        this.router.patch("/notifications/bulk/read", this.markMultipleNotificationsAsRead.bind(this));
        this.router.patch("/notifications/:id/read", this.markNotificationAsRead.bind(this));
        this.router.patch("/notifications/:id/unread", this.markNotificationAsUnread.bind(this));
        this.router.delete("/notifications/bulk", this.deleteMultipleNotifications.bind(this));
        this.router.delete("/notifications/:id", this.deleteNotification.bind(this));
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

        const result = await this.notificationService.getNotificationById(id);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
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

        const result = await this.notificationService.getNotificationsByUserId(userId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
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

        const result = await this.notificationService.getUnreadNotificationCount(userId);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * PATCH /api/v1/notifications/bulk/read
     * @param {Request} req - the request object, containing the ids in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link NotificationDTO[]} structure containing the result of the mark multiple as read operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async markMultipleNotificationsAsRead(req: Request, res: Response): Promise<void> {
        const ids = req.body as number[];

        const result = await this.notificationService.markMultipleNotificationsAsRead(ids);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * PATCH /api/v1/notifications/bulk/unread
     * @param {Request} req - the request object, containing the ids in body.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link NotificationDTO[]} structure containing the result of the mark multiple as unread operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async markMultipleNotificationsAsUnread(req: Request, res: Response): Promise<void> {
        const ids = req.body as number[];

        const result = await this.notificationService.markMultipleNotificationsAsUnread(ids);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * PATCH /api/v1/notifications/:id/read
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link NotificationDTO} structure containing the result of the mark as read operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async markNotificationAsRead(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        
        const result = await this.notificationService.markNotificationAsRead(id);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    /**
     * PATCH /api/v1/notifications/:id/unread
     * @param {Request} req - the request object, containing the id in params.
     * @param {Response} res - the response object for the client.
     * @returns {Object}
     * - On success: A JSON object following the {@link NotificationDTO} structure containing the result of the mark as unread operation. 
     * - On failure: A JSON object with an error message and a HTTP status code indicating the failure.
     */
    private async markNotificationAsUnread(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);

        const result = await this.notificationService.markNotificationAsUnread(id);
        if(result.success){
            res.status(200).json(result.data);
            return;
        }
        res.status(result.status).json({ message: result.message });
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

        const result = await this.notificationService.deleteMultipleNotifications(ids);
        if(result.success){
            res.status(204).send();
            return;
        }
        res.status(result.status).json({ message: result.message });
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

        const result = await this.notificationService.deleteNotification(id);
        if(result.success){
            res.status(204).send();
            return;
        }
        res.status(result.status).json({ message: result.message });
    }

    public getRouter() {
        return this.router;
    }
}