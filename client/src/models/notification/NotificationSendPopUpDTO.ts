import { NotificationType } from "../../enums/NotificationType";

export interface NotificationSendPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (title: string, content: string, type: NotificationType) => void;
  loading?: boolean;
  className?: string;
}