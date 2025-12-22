import { INotificationRepository } from '../Domain/services/INotificationRepository';
import { INotificationMapper } from '../Domain/services/INotificationMapper';
import { INotificationService} from '../Domain/services/INotificationService';
import { Result } from '../Domain/types/common/Result';
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

  setSocketService(socketService: SocketService): void {
    this.socketService = socketService;
  }

  async createNotification(data: NotificationCreateDTO): Promise<Result<NotificationResponseDTO>> {
    try {
      const notificationEntity = this.mapper.toEntity(data);
      const notification = this.repository.create(notificationEntity);
      const savedNotification = await this.repository.save(notification);

      if (!savedNotification) {
        console.error(' Service.createNotification: Failed to save notification');
        return { success: false, status: 500, message: 'Failed to save notification' };
      }

      const responseDTO = this.mapper.toResponseDTO(savedNotification);

      if (this.socketService) {
        this.socketService.emitNotificationCreated(responseDTO);
      }

      return { success: true, data: responseDTO };
    } catch (error) {
      console.error(' Service.createNotification error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async getNotificationById(id: number): Promise<Result<NotificationResponseDTO>> {
    try {
      const notification = await this.repository.findOne(id);

      if (!notification) {
        return { success: false, status: 404, message: 'Notification not found' };
      }

      return { success: true, data: this.mapper.toResponseDTO(notification) };
    } catch (error) {
      console.error(' Service.getNotificationById error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async getNotificationsByUserId(userId: number): Promise<Result<NotificationResponseDTO[]>> {
    try {
      const notifications = await this.repository.findByUserId(userId);
      return { success: true, data: this.mapper.toResponseDTOArray(notifications) };
    } catch (error) {
      console.error(' Service.getNotificationsByUserId error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async markAsRead(id: number): Promise<Result<NotificationResponseDTO>> {
    try {
      const notification = await this.repository.findOne(id);

      if (!notification) {
        return { success: false, status: 404, message: 'Notification not found' };
      }

      notification.isRead = true;
      const updatedNotification = await this.repository.save(notification);

      if (!updatedNotification) {
        console.error(' Service.markAsRead: Failed to update notification');
        return { success: false, status: 500, message: 'Failed to update notification' };
      }

      const responseDTO = this.mapper.toResponseDTO(updatedNotification);

      if (this.socketService) {
        this.socketService.emitNotificationMarkedRead(responseDTO);
      }

      return { success: true, data: responseDTO };
    } catch (error) {
      console.error(' Service.markAsRead error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async markAsUnread(id: number): Promise<Result<NotificationResponseDTO>> {
    try {
      const notification = await this.repository.findOne(id);

      if (!notification) {
        return { success: false, status: 404, message: 'Notification not found' };
      }

      notification.isRead = false;
      const updatedNotification = await this.repository.save(notification);

      if (!updatedNotification) {
        console.error(' Service.markAsUnread: Failed to update notification');
        return { success: false, status: 500, message: 'Failed to update notification' };
      }

      const responseDTO = this.mapper.toResponseDTO(updatedNotification);

      if (this.socketService) {
        this.socketService.emitNotificationMarkedUnread(responseDTO);
      }

      return { success: true, data: responseDTO };
    } catch (error) {
      console.error(' Service.markAsUnread error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async markMultipleAsRead(ids: number[]): Promise<Result<void>> {
    try {
      if (ids.length === 0) {
        return { success: false, status: 400, message: 'No notification IDs provided' };
      }

      const firstNotification = await this.repository.findOne(ids[0]);
      if (!firstNotification) {
        return { success: false, status: 404, message: 'Notifications not found' };
      }

      const userId = firstNotification.userId;
      const updated = await this.repository.updateMultiple(ids, { isRead: true });

      if (!updated) {
        console.error(' Service.markMultipleAsRead: Failed to update notifications');
        return { success: false, status: 500, message: 'Failed to update notifications' };
      }

      if (this.socketService) {
        this.socketService.emitNotificationsBulkMarkedRead(ids, userId!);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.markMultipleAsRead error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async markMultipleAsUnread(ids: number[]): Promise<Result<void>> {
    try {
      if (ids.length === 0) {
        return { success: false, status: 400, message: 'No notification IDs provided' };
      }

      const firstNotification = await this.repository.findOne(ids[0]);
      if (!firstNotification) {
        return { success: false, status: 404, message: 'Notifications not found' };
      }

      const userId = firstNotification.userId;
      const updated = await this.repository.updateMultiple(ids, { isRead: false });

      if (!updated) {
        console.error(' Service.markMultipleAsUnread: Failed to update notifications');
        return { success: false, status: 500, message: 'Failed to update notifications' };
      }

      if (this.socketService) {
        this.socketService.emitNotificationsBulkMarkedUnread(ids, userId!);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.markMultipleAsUnread error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async deleteNotification(id: number): Promise<Result<void>> {
    try {
      const notification = await this.repository.findOne(id);
      if (!notification) {
        return { success: false, status: 404, message: 'Notification not found' };
      }

      const userId = notification.userId;
      const deleted = await this.repository.delete(id);

      if (!deleted) {
        console.error(' Service.deleteNotification: Failed to delete notification');
        return { success: false, status: 500, message: 'Failed to delete notification' };
      }

      if (this.socketService) {
        this.socketService.emitNotificationDeleted(id, userId!);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.deleteNotification error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async deleteMultipleNotifications(ids: number[]): Promise<Result<void>> {
    try {
      if (ids.length === 0) {
        return { success: false, status: 400, message: 'No notification IDs provided' };
      }

      const firstNotification = await this.repository.findOne(ids[0]);
      if (!firstNotification) {
        return { success: false, status: 404, message: 'Notifications not found' };
      }

      const userId = firstNotification.userId;
      const deleted = await this.repository.deleteMultiple(ids);

      if (!deleted) {
        console.error(' Service.deleteMultipleNotifications: Failed to delete notifications');
        return { success: false, status: 500, message: 'Failed to delete notifications' };
      }

      if (this.socketService) {
        this.socketService.emitNotificationsBulkDeleted(ids, userId!);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.deleteMultipleNotifications error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }

  async getUnreadCount(userId: number): Promise<Result<number>> {
    try {
      const count = await this.repository.countUnread(userId);
      return { success: true, data: count };
    } catch (error) {
      console.error(' Service.getUnreadCount error:', error);
      return { success: false, status: 500, message: (error as Error).message };
    }
  }
}
