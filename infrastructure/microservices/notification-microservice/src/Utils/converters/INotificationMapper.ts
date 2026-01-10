import { Notification } from '../../Domain/models/Notification';
import { NotificationCreateDTO } from '../../Domain/DTOs/NotificationCreateDTO';
import { NotificationResponseDTO } from '../../Domain/DTOs/NotificationDTO';

export interface INotificationMapper {

  // mapira CreateDTO u Entity (za kreiranje)
  toEntity(dto: NotificationCreateDTO & { userId?: number }): Partial<Notification>;

  // mapira Entity u ResponseDTO (za slanje frontendu)
  toResponseDTO(entity: Notification): NotificationResponseDTO;

  // mapira vise Entity u ResponseDTO array
  toResponseDTOArray(entities: Notification[]): NotificationResponseDTO[];
}