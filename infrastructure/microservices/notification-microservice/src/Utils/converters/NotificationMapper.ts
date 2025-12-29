import { Notification } from '../../Domain/models/Notification';
import { NotificationCreateDTO } from '../../Domain/DTOs/NotificationCreateDTO';
import { NotificationResponseDTO } from '../../Domain/DTOs/NotificationDTO';
import { INotificationMapper } from './INotificationMapper';

export class NotificationMapper implements INotificationMapper {
  
  // mapira CreateDTO u Entity (za kreiranje)
  toEntity(dto: NotificationCreateDTO): Partial<Notification> {
    return {
      title: dto.title,
      content: dto.content,
      type: dto.type,
      userId: dto.userId,
      isRead: false
    };
  }

  // mapira Entity u ResponseDTO (za slanje frontendu)
  toResponseDTO(entity: Notification): NotificationResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      type: entity.type,
      isRead: entity.isRead,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  // mapira vise Entity u ResponseDTO array
  toResponseDTOArray(entities: Notification[]): NotificationResponseDTO[] {
    return entities.map(entity => this.toResponseDTO(entity));
  }
}