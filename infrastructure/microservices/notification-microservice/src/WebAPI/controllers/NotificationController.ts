import { Request, Response } from 'express';
import { INotificationService } from '../../Domain/Services/INotificationService';
import { NotificationCreateDTO } from '../../Domain/DTOs/NotificationCreateDTO';
import { NotificationValidation } from '../validators/NotificationValidation';
import { mapErrorCodeToHttpStatus } from '../../Utils/converters/errorCodeMapper';

export class NotificationController {
  
  private notificationService: INotificationService;

  constructor(notificationService: INotificationService) {
    this.notificationService = notificationService;
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const validationError = NotificationValidation.validateId(req.params.id);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      const result = await this.notificationService.getNotificationById(id);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching notification',
        error: (error as Error).message
      });
    }
  }

  async getNotificationsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const validationError = NotificationValidation.validateId(req.params.userId);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ message: 'Invalid user ID' });
        return;
      }

      const result = await this.notificationService.getNotificationsByUserId(userId);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user notifications',
        error: (error as Error).message
      });
    }
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const validationError = NotificationValidation.validateId(req.params.userId);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ message: 'Invalid user ID' });
        return;
      }

      const result = await this.notificationService.getUnreadCount(userId);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(200).json({ unreadCount: result.data });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching unread count',
        error: (error as Error).message
      });
    }
  }

  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const validationError = NotificationValidation.validateCreateDTO(req.body);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const data: NotificationCreateDTO = req.body;
      const result = await this.notificationService.createNotification(data);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(201).json(result.data);
    } catch (error) {
      res.status(500).json({
        message: 'Error creating notification',
        error: (error as Error).message
      });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const validationError = NotificationValidation.validateId(req.params.id);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      const result = await this.notificationService.markAsRead(id);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error marking notification as read',
        error: (error as Error).message
      });
    }
  }

  async markAsUnread(req: Request, res: Response): Promise<void> {
    try {
      const validationError = NotificationValidation.validateId(req.params.id);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      const result = await this.notificationService.markAsUnread(id);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error marking notification as unread',
        error: (error as Error).message
      });
    }
  }

  async markMultipleAsRead(req: Request, res: Response): Promise<void> {
    try {
      console.log(' DEBUG markMultipleAsRead - req.body:', req.body);
      console.log(' DEBUG markMultipleAsRead - req.body.ids:', req.body.ids);

      const validationError = NotificationValidation.validateIdsArray(req.body.ids);
      if (validationError) {
        console.log(' Validation error markMultipleAsRead:', validationError);
        res.status(400).json({ message: validationError });
        return;
      }

      const { ids } = req.body;
      console.log(' Calling service markMultipleAsRead with ids:', ids);

      const result = await this.notificationService.markMultipleAsRead(ids);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
      console.error(' Error in markMultipleAsRead:', error);
      res.status(500).json({
        message: 'Error marking notifications as read',
        error: (error as Error).message
      });
    }
  }

  async markMultipleAsUnread(req: Request, res: Response): Promise<void> {
    try {
      console.log(' DEBUG markMultipleAsUnread - req.body:', req.body);
      console.log(' DEBUG markMultipleAsUnread - req.body.ids:', req.body.ids);

      const validationError = NotificationValidation.validateIdsArray(req.body.ids);
      if (validationError) {
        console.log(' Validation error markMultipleAsUnread:', validationError);
        res.status(400).json({ message: validationError });
        return;
      }

      const { ids } = req.body;
      console.log(' Calling service markMultipleAsUnread with ids:', ids);

      const result = await this.notificationService.markMultipleAsUnread(ids);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(200).json({ message: 'Notifications marked as unread' });
    } catch (error) {
      console.error(' Error in markMultipleAsUnread:', error);
      res.status(500).json({
        message: 'Error marking notifications as unread',
        error: (error as Error).message
      });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const validationError = NotificationValidation.validateId(req.params.id);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      const result = await this.notificationService.deleteNotification(id);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting notification',
        error: (error as Error).message
      });
    }
  }

  async deleteMultipleNotifications(req: Request, res: Response): Promise<void> {
    try {
      console.log(' DEBUG deleteMultiple - req.body:', req.body);
      console.log(' DEBUG deleteMultiple - req.body.ids:', req.body.ids);

      const validationError = NotificationValidation.validateIdsArray(req.body.ids);
      if (validationError) {
        console.log(' Validation error deleteMultiple:', validationError);
        res.status(400).json({ message: validationError });
        return;
      }

      const { ids } = req.body;
      console.log(' Calling service deleteMultiple with ids:', ids);

      const result = await this.notificationService.deleteMultipleNotifications(ids);

      if (!result.success) {
        const statusCode = mapErrorCodeToHttpStatus(result.errorCode);
        res.status(statusCode).json({ message: result.message });
        return;
      }

      res.status(200).json({ message: 'Notifications deleted successfully' });
    } catch (error) {
      console.error(' Error in deleteMultiple:', error);
      res.status(500).json({
        message: 'Error deleting notifications',
        error: (error as Error).message
      });
    }
  }
}
