import { Router } from 'express';
import { NotificationController } from './controllers/NotificationController';
import { INotificationService } from '../Domain/services/INotificationService';

/**
 * Kreira Express Router sa svim notification rutama
 * @param notificationService - Injektovani NotificationService
 */
export const createNotificationRoutes = (notificationService: INotificationService): Router => {
  
  const router = Router();
  const controller = new NotificationController(notificationService);

  console.log(' Routes created! Registering all notification routes...');

  // BULK ROUTES - MORAJU BITI PRE :id RUTA!
  /**
   * PATCH /notifications/bulk/read
   * Oznaci vise notifikacija kao procitane
   */
  router.patch('/notifications/bulk/read', (req, res) => {
    console.log(' ROUTE HANDLER - bulk/read called!');
    console.log(' ROUTE - req.body:', req.body);
    controller.markMultipleAsRead(req, res);
  });

  /**
   * PATCH /notifications/bulk/unread
   * Oznaci vise notifikacija kao neprocitane
   */
  router.patch('/notifications/bulk/unread', (req, res) => {
    console.log(' ROUTE HANDLER CALLED - bulk/unread');
    console.log(' ROUTE - req.body:', req.body);
    console.log(' ROUTE - req.body.ids:', req.body.ids);
    console.log(' ROUTE - typeof req.body.ids:', typeof req.body.ids);
    console.log(' ROUTE - Array.isArray(req.body.ids):', Array.isArray(req.body.ids));
    controller.markMultipleAsUnread(req, res);
  });

  /**
   * DELETE /notifications/bulk
   * Brise vise notifikacija odjednom
   */
  router.delete('/notifications/bulk', (req, res) => {
    console.log(' ROUTE HANDLER - bulk/delete called!');
    console.log(' ROUTE - req.body:', req.body);
    controller.deleteMultipleNotifications(req, res);
  });


  // GET ROUTES
  /**
   * GET /notifications/user/:userId
   * Vraca notifikacije za odredjenog korisnika
   */
  router.get('/notifications/user/:userId', (req, res) => 
    controller.getNotificationsByUserId(req, res)
  );

  /**
   * GET /notifications/user/:userId/unread-count
   * Vraca broj neprocitanih notifikacija za korisnika
   */
  router.get('/notifications/user/:userId/unread-count', (req, res) => 
    controller.getUnreadCount(req, res)
  );

  /**
   * GET /notifications/:id
   * Vraca notifikaciju po ID-u
   */
  router.get('/notifications/:id', (req, res) => 
    controller.getNotificationById(req, res)
  );

  // POST ROUTES
  /**
   * POST /notifications
   * Kreira novu notifikaciju
   */
  router.post('/notifications', (req, res) => 
    controller.createNotification(req, res)
  );

  // PATCH ROUTES
  /**
   * PATCH /notifications/:id/read
   * Oznaci notifikaciju kao procitanu
   */
  router.patch('/notifications/:id/read', (req, res) => 
    controller.markAsRead(req, res)
  );

  /**
   * PATCH /notifications/:id/unread
   * Oznaci notifikaciju kao neprocitanu
   */
  router.patch('/notifications/:id/unread', (req, res) => 
    controller.markAsUnread(req, res)
  );

  // DELETE ROUTES
  /**
   * DELETE /notifications/:id
   * Brise notifikaciju
   */
  router.delete('/notifications/:id', (req, res) => 
    controller.deleteNotification(req, res)
  );

  console.log(' All routes registered successfully!');
  
  return router;
};