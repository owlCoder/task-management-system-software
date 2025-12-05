import { Notification } from '../models/Notification';
import { NotificationCreateDTO } from '../DTOs/NotificationCreateDTO';
import { NotificationResponseDTO } from '../DTOs/NotificationResponseDTO';

export interface INotificationMapper {
  

  // mapira CreateDTO u Entity (za kreiranje)
  toEntity(dto: NotificationCreateDTO): Partial<Notification>;

  // mapira Entity u ResponseDTO (za slanje frontendu)
  toResponseDTO(entity: Notification): NotificationResponseDTO;

  // mapira vise Entity u ResponseDTO array
  toResponseDTOArray(entities: Notification[]): NotificationResponseDTO[];
}