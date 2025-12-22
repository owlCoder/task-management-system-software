import { Request, Response } from 'express';
import { INotificationService } from '../../Domain/services/INotificationService';
import { NotificationCreateDTO } from '../../Domain/DTOs/NotificationCreateDTO';
import { NotificationValidation } from '../validators/NotificationValidation';

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
      const notification = await this.notificationService.getNotificationById(id);
      
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }

      res.status(200).json(notification);
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
      const notifications = await this.notificationService.getNotificationsByUserId(userId);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching user notifications', 
        error: (error as Error).message 
      });
    }
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      // validacija userId
      const validationError = NotificationValidation.validateId(req.params.userId);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const userId = parseInt(req.params.userId);
      const count = await this.notificationService.getUnreadCount(userId);
      res.status(200).json({ unreadCount: count });
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
      const notification = await this.notificationService.createNotification(data);
      
      if (!notification) {
        res.status(500).json({ message: 'Failed to create notification' });
        return;
      }
      
      res.status(201).json(notification);
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
      const notification = await this.notificationService.markAsRead(id);
      
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }

      res.status(200).json(notification);
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
      const notification = await this.notificationService.markAsUnread(id);
      
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }

      res.status(200).json(notification);
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
      
      const success = await this.notificationService.markMultipleAsRead(ids);
      
      if (!success) {
        res.status(500).json({ message: 'Failed to mark notifications as read' });
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
      
      const success = await this.notificationService.markMultipleAsUnread(ids);
      
      if (!success) {
        res.status(500).json({ message: 'Failed to mark notifications as unread' });
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
      const deleted = await this.notificationService.deleteNotification(id);
      
      if (!deleted) {
        res.status(404).json({ message: 'Notification not found' });
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
      
      const success = await this.notificationService.deleteMultipleNotifications(ids);
      
      if (!success) {
        res.status(500).json({ message: 'Failed to delete notifications' });
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
