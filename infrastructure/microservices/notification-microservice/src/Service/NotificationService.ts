import { INotificationRepository } from '../Domain/services/INotificationRepository';
import { INotificationMapper } from '../Domain/services/INotificationMapper';
import { INotificationService } from '../Domain/services/INotificationService';
import { NotificationCreateDTO } from '../Domain/DTOs/NotificationCreateDTO';
import { NotificationUpdateDTO } from '../Domain/DTOs/NotificationUpdateDTO';
import { NotificationResponseDTO } from '../Domain/DTOs/NotificationResponseDTO';

export class NotificationService implements INotificationService {
  
  private repository: INotificationRepository;
  private mapper: INotificationMapper;

  constructor(repository: INotificationRepository, mapper: INotificationMapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

   // kreira novu notifikaciju
  async createNotification(data: NotificationCreateDTO): Promise<NotificationResponseDTO> {
    const notificationEntity = this.mapper.toEntity(data);
    const notification = this.repository.create(notificationEntity);
    const savedNotification = await this.repository.save(notification);
    return this.mapper.toResponseDTO(savedNotification);
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
    return this.mapper.toResponseDTO(updatedNotification);
  }

   // oznaci notifikaciju kao procitanu
  async markAsRead(id: number): Promise<NotificationResponseDTO | null> {
    return this.updateNotification(id, { isRead: true });
  }

   // oznaci notifikaciju kao neprocitanu
  async markAsUnread(id: number): Promise<NotificationResponseDTO | null> {
    return this.updateNotification(id, { isRead: false });
  }

   // oznaci vise notifikacija kao procitane
  async markMultipleAsRead(ids: number[]): Promise<void> {
    await this.repository.updateMultiple(ids, { isRead: true });
  }

   // oznaci vise notifikacija kao neprocitane
  async markMultipleAsUnread(ids: number[]): Promise<void> {
    await this.repository.updateMultiple(ids, { isRead: false });
  }

   // brise notifikaciju
  async deleteNotification(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }

   // brise vise notifikacija odjednom
  async deleteMultipleNotifications(ids: number[]): Promise<void> {
    await this.repository.deleteMultiple(ids);
  }

   // vraca broj neprocitanih notifikacija za korisnika
  async getUnreadCount(userId: number): Promise<number> {
    return await this.repository.countUnread(userId);
  }
}