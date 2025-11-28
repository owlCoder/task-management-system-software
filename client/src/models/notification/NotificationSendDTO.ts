export interface SendNotificationFormData {
  type: 'info' | 'warning' | 'error';
  title?: string;
  content: string;
  recipients?: number[]; // user IDs
}

export interface SendNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: SendNotificationFormData) => Promise<void>;
  loading?: boolean;
}
