import { Request, Response } from 'express';
import { INotificationService } from '../../Domain/services/INotificationService';
import { NotificationCreateDTO } from '../../Domain/DTOs/NotificationCreateDTO';
import { NotificationUpdateDTO } from '../../Domain/DTOs/NotificationUpdateDTO';
import { NotificationValidation } from '../validators/NotificationValidation';

export class NotificationController {
  
  private notificationService: INotificationService;

  constructor(notificationService: INotificationService) {
    this.notificationService = notificationService;
  }

  /**
   * GET /notifications
   * vraca sve notifikacije
   */
  async getAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const notifications = await this.notificationService.getAllNotifications();
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching notifications', 
        error: (error as Error).message 
      });
    }
  }

  /**
   * GET /notifications/:id
   * vraca notifikaciju po ID-u
   */
  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      // validacija ID-a
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

  /**
   * GET /notifications/user/:userId
   * vraca notifikacije za odredjenog korisnika
   */
  async getNotificationsByUserId(req: Request, res: Response): Promise<void> {
    try {
      // validacija userId
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

  /**
   * GET /notifications/user/:userId/unread-count
   * vraca broj neprocitanih notifikacija za korisnika
   */
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

  /**
   * POST /notifications
   * kreira novu notifikaciju
   */
  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      // validacija podataka
      const validationError = NotificationValidation.validateCreateDTO(req.body);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const data: NotificationCreateDTO = req.body;
      const notification = await this.notificationService.createNotification(data);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error creating notification', 
        error: (error as Error).message 
      });
    }
  }

  /**
   * PATCH /notifications/:id
   * azurira notifikaciju
   */
  async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      // validacija ID-a
      const idValidationError = NotificationValidation.validateId(req.params.id);
      if (idValidationError) {
        res.status(400).json({ message: idValidationError });
        return;
      }

      // validacija podataka
      const dataValidationError = NotificationValidation.validateUpdateDTO(req.body);
      if (dataValidationError) {
        res.status(400).json({ message: dataValidationError });
        return;
      }

      const id = parseInt(req.params.id);
      const data: NotificationUpdateDTO = req.body;
      const notification = await this.notificationService.updateNotification(id, data);
      
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }

      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating notification', 
        error: (error as Error).message 
      });
    }
  }

  /**
   * PATCH /notifications/:id/read
   * oznaci notifikaciju kao procitanu
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      // validacija ID-a
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

  /**
   * PATCH /notifications/:id/unread
   * oznaci notifikaciju kao neprocitanu
   */
  async markAsUnread(req: Request, res: Response): Promise<void> {
    try {
      // validacija ID-a
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

  /**
   * PATCH /notifications/bulk/read
   * oznaci vise notifikacija kao procitane
   */
  async markMultipleAsRead(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔍 DEBUG markMultipleAsRead - req.body:', req.body);
      console.log('🔍 DEBUG markMultipleAsRead - req.body.ids:', req.body.ids);
      
      // validacija IDs array-a
      const validationError = NotificationValidation.validateIdsArray(req.body.ids);
      if (validationError) {
        console.log('❌ Validation error markMultipleAsRead:', validationError);
        res.status(400).json({ message: validationError });
        return;
      }

      const { ids } = req.body;
      console.log('✅ Calling service markMultipleAsRead with ids:', ids);
      
      await this.notificationService.markMultipleAsRead(ids);
      res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
      console.error('❌ Error in markMultipleAsRead:', error);
      res.status(500).json({ 
        message: 'Error marking notifications as read', 
        error: (error as Error).message 
      });
    }
  }

  /**
   * PATCH /notifications/bulk/unread
   * oznaci vise notifikacija kao neprocitane
   */
  async markMultipleAsUnread(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔍 DEBUG markMultipleAsUnread - req.body:', req.body);
      console.log('🔍 DEBUG markMultipleAsUnread - req.body.ids:', req.body.ids);
      
      // validacija IDs array-a
      const validationError = NotificationValidation.validateIdsArray(req.body.ids);
      if (validationError) {
        console.log('❌ Validation error markMultipleAsUnread:', validationError);
        res.status(400).json({ message: validationError });
        return;
      }

      const { ids } = req.body;
      console.log('✅ Calling service markMultipleAsUnread with ids:', ids);
      
      await this.notificationService.markMultipleAsUnread(ids);
      res.status(200).json({ message: 'Notifications marked as unread' });
    } catch (error) {
      console.error('❌ Error in markMultipleAsUnread:', error);
      res.status(500).json({ 
        message: 'Error marking notifications as unread', 
        error: (error as Error).message 
      });
    }
  }

  /**
   * DELETE /notifications/:id
   * brise notifikaciju
   */
  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      // validacija ID-a
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

  /**
   * DELETE /notifications/bulk
   * brise vise notifikacija odjednom
   */
  async deleteMultipleNotifications(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔍 DEBUG deleteMultiple - req.body:', req.body);
      console.log('🔍 DEBUG deleteMultiple - req.body.ids:', req.body.ids);
      
      // validacija IDs array-a
      const validationError = NotificationValidation.validateIdsArray(req.body.ids);
      if (validationError) {
        console.log('❌ Validation error deleteMultiple:', validationError);
        res.status(400).json({ message: validationError });
        return;
      }

      const { ids } = req.body;
      console.log('✅ Calling service deleteMultiple with ids:', ids);
      
      await this.notificationService.deleteMultipleNotifications(ids);
      res.status(200).json({ message: 'Notifications deleted successfully' });
    } catch (error) {
      console.error('❌ Error in deleteMultiple:', error);
      res.status(500).json({ 
        message: 'Error deleting notifications', 
        error: (error as Error).message 
      });
    }
  }
}