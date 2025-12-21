import { INotificationRepository } from '../Domain/services/INotificationRepository';
import { INotificationMapper } from '../Domain/services/INotificationMapper';
import { INotificationService } from '../Domain/services/INotificationService';
import { NotificationCreateDTO } from '../Domain/DTOs/NotificationCreateDTO';
import { NotificationResponseDTO } from '../Domain/DTOs/NotificationDTO';
import { SocketService } from '../WebSocket/SocketService';

export class NotificationService implements INotificationService {

  private repository: INotificationRepository;
  private mapper: INotificationMapper;
  private socketService?: SocketService;

  constructor(repository: INotificationRepository, mapper: INotificationMapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Injektuje SocketService za real-time events
   */
  setSocketService(socketService: SocketService): void {
    this.socketService = socketService;
  }

  // kreira novu notifikaciju
  async createNotification(data: NotificationCreateDTO): Promise<NotificationResponseDTO | null> {
    try {
      const notificationEntity = this.mapper.toEntity(data);
      const notification = this.repository.create(notificationEntity);
      const savedNotification = await this.repository.save(notification);

      if (!savedNotification) {
        console.error(' Service.createNotification: Failed to save notification');
        return null;
      }

      const responseDTO = this.mapper.toResponseDTO(savedNotification);

      // Emit WebSocket event
      if (this.socketService) {
        this.socketService.emitNotificationCreated(responseDTO);
      }

      return responseDTO;
    } catch (error) {
      console.error(' Service.createNotification error:', error);
      return null;
    }
  }

  // vraca notifikaciju po ID-u
  async getNotificationById(id: number): Promise<NotificationResponseDTO | null> {
    try {
      const notification = await this.repository.findOne(id);

      if (!notification) {
        return null;
      }

      return this.mapper.toResponseDTO(notification);
    } catch (error) {
      console.error(' Service.getNotificationById error:', error);
      return null;
    }
  }

  // vraca notifikacije za odredjenog korisnika
  async getNotificationsByUserId(userId: number): Promise<NotificationResponseDTO[]> {
    try {
      const notifications = await this.repository.findByUserId(userId);
      return this.mapper.toResponseDTOArray(notifications);
    } catch (error) {
      console.error(' Service.getNotificationsByUserId error:', error);
      return [];
    }
  }

  // oznaci notifikaciju kao procitanu
  async markAsRead(id: number): Promise<NotificationResponseDTO | null> {
    try {
      const notification = await this.repository.findOne(id);

      if (!notification) {
        return null;
      }

      notification.isRead = true;
      const updatedNotification = await this.repository.save(notification);

      if (!updatedNotification) {
        console.error(' Service.markAsRead: Failed to update notification');
        return null;
      }

      const responseDTO = this.mapper.toResponseDTO(updatedNotification);

      // Emit WebSocket event
      if (this.socketService) {
        this.socketService.emitNotificationMarkedRead(responseDTO);
      }

      return responseDTO;
    } catch (error) {
      console.error(' Service.markAsRead error:', error);
      return null;
    }
  }

  // oznaci notifikaciju kao neprocitanu
  async markAsUnread(id: number): Promise<NotificationResponseDTO | null> {
    try {
      const notification = await this.repository.findOne(id);

      if (!notification) {
        return null;
      }

      notification.isRead = false;
      const updatedNotification = await this.repository.save(notification);

      if (!updatedNotification) {
        console.error(' Service.markAsUnread: Failed to update notification');
        return null;
      }

      const responseDTO = this.mapper.toResponseDTO(updatedNotification);

      // Emit WebSocket event
      if (this.socketService) {
        this.socketService.emitNotificationMarkedUnread(responseDTO);
      }

      return responseDTO;
    } catch (error) {
      console.error(' Service.markAsUnread error:', error);
      return null;
    }
  }

  // oznaci vise notifikacija kao procitane
  async markMultipleAsRead(ids: number[]): Promise<boolean> {
    try {
      if (ids.length === 0) return false;

      // Dobavi userId od prve notifikacije
      const firstNotification = await this.repository.findOne(ids[0]);
      if (!firstNotification) return false;

      const userId = firstNotification.userId;

      const updated = await this.repository.updateMultiple(ids, { isRead: true });

      if (!updated) {
        console.error(' Service.markMultipleAsRead: Failed to update notifications');
        return false;
      }

      // Emit WebSocket event
      if (this.socketService) {
        this.socketService.emitNotificationsBulkMarkedRead(ids, userId!);
      }

      return true;
    } catch (error) {
      console.error(' Service.markMultipleAsRead error:', error);
      return false;
    }
  }

  // oznaci vise notifikacija kao neprocitane
  async markMultipleAsUnread(ids: number[]): Promise<boolean> {
    try {
      if (ids.length === 0) return false;

      // Dobavi userId od prve notifikacije
      const firstNotification = await this.repository.findOne(ids[0]);
      if (!firstNotification) return false;

      const userId = firstNotification.userId;

      const updated = await this.repository.updateMultiple(ids, { isRead: false });

      if (!updated) {
        console.error(' Service.markMultipleAsUnread: Failed to update notifications');
        return false;
      }

      // Emit WebSocket event
      if (this.socketService) {
        this.socketService.emitNotificationsBulkMarkedUnread(ids, userId!);
      }

      return true;
    } catch (error) {
      console.error(' Service.markMultipleAsUnread error:', error);
      return false;
    }
  }

  // brise notifikaciju
  async deleteNotification(id: number): Promise<boolean> {
    try {
      // Prvo dobavi notifikaciju da bi znali userId
      const notification = await this.repository.findOne(id);
      if (!notification) {
        return false;
      }

      const userId = notification.userId;
      const deleted = await this.repository.delete(id);

      if (!deleted) {
        console.error(' Service.deleteNotification: Failed to delete notification');
        return false;
      }

      // Emit WebSocket event
      if (this.socketService) {
        this.socketService.emitNotificationDeleted(id, userId!);
      }

      return true;
    } catch (error) {
      console.error(' Service.deleteNotification error:', error);
      return false;
    }
  }

  // brise vise notifikacija odjednom
  async deleteMultipleNotifications(ids: number[]): Promise<boolean> {
    try {
      if (ids.length === 0) return false;

      // Dobavi userId od prve notifikacije
      const firstNotification = await this.repository.findOne(ids[0]);
      if (!firstNotification) return false;

      const userId = firstNotification.userId;

      const deleted = await this.repository.deleteMultiple(ids);

      if (!deleted) {
        console.error(' Service.deleteMultipleNotifications: Failed to delete notifications');
        return false;
      }

      // Emit WebSocket event
      if (this.socketService) {
        this.socketService.emitNotificationsBulkDeleted(ids, userId!);
      }

      return true;
    } catch (error) {
      console.error(' Service.deleteMultipleNotifications error:', error);
      return false;
    }
  }

  // vraca broj neprocitanih notifikacija za korisnika
  async getUnreadCount(userId: number): Promise<number> {
    try {
      return await this.repository.countUnread(userId);
    } catch (error) {
      console.error(' Service.getUnreadCount error:', error);
      return 0;
    }
  }
}