import { Notification } from '../models/Notification';
import { NotificationCreateDTO } from '../DTOs/NotificationCreateDTO';
import { NotificationResponseDTO } from '../DTOs/NotificationResponseDTO';

export class NotificationMapper {
  
  /**
   * Mapira CreateDTO u Entity (za kreiranje)
   */
  static toEntity(dto: NotificationCreateDTO): Partial<Notification> {
    return {
      title: dto.title,
      content: dto.content,
      type: dto.type,
      userId: dto.userId,
      isRead: false
    };
  }

  /**
   * Mapira Entity u ResponseDTO (za slanje frontendu)
   */
  static toResponseDTO(entity: Notification): NotificationResponseDTO {
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

  /**
   * Mapira vise Entity u ResponseDTO array
   */
  static toResponseDTOArray(entities: Notification[]): NotificationResponseDTO[] {
    return entities.map(entity => this.toResponseDTO(entity));
  }
}