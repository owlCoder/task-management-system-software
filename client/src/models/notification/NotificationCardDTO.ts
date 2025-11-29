export interface Notification {
  id: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  type?: 'info' | 'warning' | 'error';
  source?: string;
}

export interface NotificationCardProps {
  notification: Notification;
  onClick?: (id: number) => void;
  isSelected?: boolean;                    
  onSelectChange?: (id: number) => void;   
  className?: string;
}