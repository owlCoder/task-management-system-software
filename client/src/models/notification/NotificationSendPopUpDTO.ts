export interface NotificationSendPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (title: string, content: string) => void;
  className?: string;
}