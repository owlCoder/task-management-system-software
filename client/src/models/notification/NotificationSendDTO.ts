export interface SendNotificationFormData {
  type: 'info' | 'warning' | 'error';
  title?: string;
  content: string;
  recipients?: number[]; 
  // user IDs
}

export interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: SendNotificationFormData) => Promise<void>;
  loading?: boolean;
}

export interface SendNotificationProps {
  onClick?: () => void;
  className?: string;
}