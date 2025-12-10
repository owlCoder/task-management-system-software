import { INotificationRepository } from '../Domain/services/INotificationRepository';
import { INotificationMapper } from '../Domain/services/INotificationMapper';
import { INotificationService } from '../Domain/services/INotificationService';
import { NotificationCreateDTO } from '../Domain/DTOs/NotificationCreateDTO';
import { NotificationUpdateDTO } from '../Domain/DTOs/NotificationUpdateDTO';
import { NotificationResponseDTO } from '../Domain/DTOs/NotificationResponseDTO';
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
  async createNotification(data: NotificationCreateDTO): Promise<NotificationResponseDTO> {
    const notificationEntity = this.mapper.toEntity(data);
    const notification = this.repository.create(notificationEntity);
    const savedNotification = await this.repository.save(notification);
    const responseDTO = this.mapper.toResponseDTO(savedNotification);
    
    // Emit WebSocket event
    if (this.socketService) {
      this.socketService.emitNotificationCreated(responseDTO);
    }
    
    return responseDTO;
  }

  // vraca sve notifikacije
  async getAllNotifications(): Promise<NotificationResponseDTO[]> {
    const notifications = await this.repository.findAll();
    return this.mapper.toResponseDTOArray(notifications);
  }

  // vraca notifikaciju po ID-u
  async getNotificationById(id: number): Promise<NotificationResponseDTO | null> {
    const notification = await this.repository.findOne(id);
    
    if (!notification) {
      return null;
    }

    return this.mapper.toResponseDTO(notification);
  }

  // vraca notifikacije za odredjenog korisnika
  async getNotificationsByUserId(userId: number): Promise<NotificationResponseDTO[]> {
    const notifications = await this.repository.findByUserId(userId);
    return this.mapper.toResponseDTOArray(notifications);
  }

  // azurira notifikaciju
  async updateNotification(id: number, data: NotificationUpdateDTO): Promise<NotificationResponseDTO | null> {
    const notification = await this.repository.findOne(id);

    if (!notification) {
      return null;
    }

    // azuriraj samo polja koja su prosledjena
    if (data.title !== undefined) notification.title = data.title;
    if (data.content !== undefined) notification.content = data.content;
    if (data.type !== undefined) notification.type = data.type;
    if (data.isRead !== undefined) notification.isRead = data.isRead;

    const updatedNotification = await this.repository.save(notification);
    const responseDTO = this.mapper.toResponseDTO(updatedNotification);
    
    // Emit WebSocket event
    if (this.socketService) {
      this.socketService.emitNotificationUpdated(responseDTO);
    }
    
    return responseDTO;
  }

  // oznaci notifikaciju kao procitanu
  async markAsRead(id: number): Promise<NotificationResponseDTO | null> {
    const notification = await this.repository.findOne(id);
    
    if (!notification) {
      return null;
    }
    
    notification.isRead = true;
    const updatedNotification = await this.repository.save(notification);
    const responseDTO = this.mapper.toResponseDTO(updatedNotification);
    
    // Emit WebSocket event
    if (this.socketService) {
      this.socketService.emitNotificationMarkedRead(responseDTO);
    }
    
    return responseDTO;
  }

  // oznaci notifikaciju kao neprocitanu
  async markAsUnread(id: number): Promise<NotificationResponseDTO | null> {
    const notification = await this.repository.findOne(id);
    
    if (!notification) {
      return null;
    }
    
    notification.isRead = false;
    const updatedNotification = await this.repository.save(notification);
    const responseDTO = this.mapper.toResponseDTO(updatedNotification);
    
    // Emit WebSocket event
    if (this.socketService) {
      this.socketService.emitNotificationMarkedUnread(responseDTO);
    }
    
    return responseDTO;
  }

  // oznaci vise notifikacija kao procitane
  async markMultipleAsRead(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    
    // Dobavi userId od prve notifikacije
    const firstNotification = await this.repository.findOne(ids[0]);
    if (!firstNotification) return;
    
    const userId = firstNotification.userId;
    
    await this.repository.updateMultiple(ids, { isRead: true });
    
    // Emit WebSocket event
    if (this.socketService) {
      this.socketService.emitNotificationsBulkMarkedRead(ids, userId!);
    }
  }

  // oznaci vise notifikacija kao neprocitane
  async markMultipleAsUnread(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    
    // Dobavi userId od prve notifikacije
    const firstNotification = await this.repository.findOne(ids[0]);
    if (!firstNotification) return;
    
    const userId = firstNotification.userId;
    
    await this.repository.updateMultiple(ids, { isRead: false });
    
    // Emit WebSocket event
    if (this.socketService) {
      this.socketService.emitNotificationsBulkMarkedUnread(ids, userId!);
    }
  }

  // brise notifikaciju
  async deleteNotification(id: number): Promise<boolean> {
    // Prvo dobavi notifikaciju da bi znali userId
    const notification = await this.repository.findOne(id);
    if (!notification) {
      return false;
    }
    
    const userId = notification.userId;
    const deleted = await this.repository.delete(id);
    
    // Emit WebSocket event
    if (deleted && this.socketService) {
      this.socketService.emitNotificationDeleted(id, userId!);
    }
    
    return deleted;
  }

  // brise vise notifikacija odjednom
  async deleteMultipleNotifications(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    
    // Dobavi userId od prve notifikacije
    const firstNotification = await this.repository.findOne(ids[0]);
    if (!firstNotification) return;
    
    const userId = firstNotification.userId;
    
    await this.repository.deleteMultiple(ids);
    
    // Emit WebSocket event
    if (this.socketService) {
      this.socketService.emitNotificationsBulkDeleted(ids, userId!);
    }
  }

  // vraca broj neprocitanih notifikacija za korisnika
  async getUnreadCount(userId: number): Promise<number> {
    return await this.repository.countUnread(userId);
  }
}