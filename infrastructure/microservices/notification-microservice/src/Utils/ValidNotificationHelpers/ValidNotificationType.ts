import { NotificationType } from "../../Domain/enums/NotificationType";
 // helper funkcija za validaciju notification type-a
 // koristi se u validaciji za proveru da li je type validan
export function isValidNotificationType(type: string): type is NotificationType {
  return Object.values(NotificationType).includes(type as NotificationType);
}

export const VALID_NOTIFICATION_TYPES = Object.values(NotificationType);
