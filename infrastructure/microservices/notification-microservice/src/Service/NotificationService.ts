import { Repository, In } from 'typeorm';
import { Notification } from '../Domain/models/Notification';
import { INotificationMapper } from '../Utils/converters/INotificationMapper';
import { INotificationService} from '../Domain/services/INotificationService';
import { Result } from '../Domain/types/common/Result';
import { ErrorCode } from '../Domain/types/common/ErrorCode';
import { NotificationCreateDTO } from '../Domain/DTOs/NotificationCreateDTO';
import { NotificationResponseDTO } from '../Domain/DTOs/NotificationDTO';
import { SocketService } from '../WebSocket/SocketService';

export class NotificationService implements INotificationService {

  private repository: Repository<Notification>;
  private mapper: INotificationMapper;
  private socketService?: SocketService;

  constructor(repository: Repository<Notification>, mapper: INotificationMapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

  setSocketService(socketService: SocketService): void {
    this.socketService = socketService;
  }

  async createNotification(data: NotificationCreateDTO): Promise<Result<NotificationResponseDTO[]>> {
    try {
      const createdNotifications: NotificationResponseDTO[] = [];

      // Kreiraj notifikaciju za svaki userId u listi
      for (const userId of data.userIds) {
        const notificationEntity = this.mapper.toEntity({
          ...data,
          userId
        });
        const notification = this.repository.create(notificationEntity);
        const savedNotification = await this.repository.save(notification);

        if (!savedNotification) {
          console.error(` Service.createNotification: Failed to save notification for user ${userId}`);
          continue; // Nastavi sa sledecim korisnikom
        }

        const responseDTO = this.mapper.toResponseDTO(savedNotification);
        createdNotifications.push(responseDTO);

        // Emituj WebSocket event za svakog korisnika
        if (this.socketService) {
          this.socketService.emitNotificationCreated(responseDTO);
        }
      }

      if (createdNotifications.length === 0) {
        return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: 'Failed to create any notifications' };
      }

      return { success: true, data: createdNotifications };
    } catch (error) {
      console.error(' Service.createNotification error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async getNotificationById(id: number): Promise<Result<NotificationResponseDTO>> {
    try {
      const notification = await this.repository.findOne({ where: { id } });

      if (!notification) {
        return { success: false, errorCode: ErrorCode.NOT_FOUND, message: 'Notification not found' };
      }

      return { success: true, data: this.mapper.toResponseDTO(notification) };
    } catch (error) {
      console.error(' Service.getNotificationById error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async getNotificationsByUserId(userId: number): Promise<Result<NotificationResponseDTO[]>> {
    try {
      const notifications = await this.repository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });
      return { success: true, data: this.mapper.toResponseDTOArray(notifications) };
    } catch (error) {
      console.error(' Service.getNotificationsByUserId error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async markAsRead(id: number): Promise<Result<void>> {
    try {
      const notification = await this.repository.findOne({ where: { id } });

      if (!notification) {
        return { success: false, errorCode: ErrorCode.NOT_FOUND, message: 'Notification not found' };
      }

      notification.isRead = true;
      const updatedNotification = await this.repository.save(notification);

      if (!updatedNotification) {
        console.error(' Service.markAsRead: Failed to update notification');
        return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: 'Failed to update notification' };
      }

      const responseDTO = this.mapper.toResponseDTO(updatedNotification);

      if (this.socketService) {
        this.socketService.emitNotificationMarkedRead(responseDTO);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.markAsRead error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async markAsUnread(id: number): Promise<Result<void>> {
    try {
      const notification = await this.repository.findOne({ where: { id } });

      if (!notification) {
        return { success: false, errorCode: ErrorCode.NOT_FOUND, message: 'Notification not found' };
      }

      notification.isRead = false;
      const updatedNotification = await this.repository.save(notification);

      if (!updatedNotification) {
        console.error(' Service.markAsUnread: Failed to update notification');
        return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: 'Failed to update notification' };
      }

      const responseDTO = this.mapper.toResponseDTO(updatedNotification);

      if (this.socketService) {
        this.socketService.emitNotificationMarkedUnread(responseDTO);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.markAsUnread error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async markMultipleAsRead(ids: number[]): Promise<Result<void>> {
    try {
      if (ids.length === 0) {
        return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: 'No notification IDs provided' };
      }

      const firstNotification = await this.repository.findOne({ where: { id: ids[0] } });
      if (!firstNotification) {
        return { success: false, errorCode: ErrorCode.NOT_FOUND, message: 'Notifications not found' };
      }

      const userId = firstNotification.userId;
      const result = await this.repository.update({ id: In(ids) }, { isRead: true });

      if (result.affected === 0) {
        console.error(' Service.markMultipleAsRead: Failed to update notifications');
        return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: 'Failed to update notifications' };
      }

      if (this.socketService) {
        this.socketService.emitNotificationsBulkMarkedRead(ids, userId!);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.markMultipleAsRead error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async markMultipleAsUnread(ids: number[]): Promise<Result<void>> {
    try {
      if (ids.length === 0) {
        return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: 'No notification IDs provided' };
      }

      const firstNotification = await this.repository.findOne({ where: { id: ids[0] } });
      if (!firstNotification) {
        return { success: false, errorCode: ErrorCode.NOT_FOUND, message: 'Notifications not found' };
      }

      const userId = firstNotification.userId;
      const result = await this.repository.update({ id: In(ids) }, { isRead: false });

      if (result.affected === 0) {
        console.error(' Service.markMultipleAsUnread: Failed to update notifications');
        return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: 'Failed to update notifications' };
      }

      if (this.socketService) {
        this.socketService.emitNotificationsBulkMarkedUnread(ids, userId!);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.markMultipleAsUnread error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async deleteNotification(id: number): Promise<Result<void>> {
    try {
      const notification = await this.repository.findOne({ where: { id } });
      if (!notification) {
        return { success: false, errorCode: ErrorCode.NOT_FOUND, message: 'Notification not found' };
      }

      const userId = notification.userId;
      const result = await this.repository.delete(id);

      if (result.affected === 0) {
        console.error(' Service.deleteNotification: Failed to delete notification');
        return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: 'Failed to delete notification' };
      }

      if (this.socketService) {
        this.socketService.emitNotificationDeleted(id, userId!);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.deleteNotification error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async deleteMultipleNotifications(ids: number[]): Promise<Result<void>> {
    try {
      if (ids.length === 0) {
        return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: 'No notification IDs provided' };
      }

      const firstNotification = await this.repository.findOne({ where: { id: ids[0] } });
      if (!firstNotification) {
        return { success: false, errorCode: ErrorCode.NOT_FOUND, message: 'Notifications not found' };
      }

      const userId = firstNotification.userId;
      const result = await this.repository.delete(ids);

      if (result.affected === 0) {
        console.error(' Service.deleteMultipleNotifications: Failed to delete notifications');
        return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: 'Failed to delete notifications' };
      }

      if (this.socketService) {
        this.socketService.emitNotificationsBulkDeleted(ids, userId!);
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error(' Service.deleteMultipleNotifications error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }

  async getUnreadCount(userId: number): Promise<Result<number>> {
    try {
      const count = await this.repository.count({
        where: { userId, isRead: false }
      });
      return { success: true, data: count };
    } catch (error) {
      console.error(' Service.getUnreadCount error:', error);
      return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: (error as Error).message };
    }
  }
}
