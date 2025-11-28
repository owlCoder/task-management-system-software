export interface Notification {
  id: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  type?: 'info' | 'warning' | 'error'; // za buduću upotrebu
  source?: string; // npr. "Auth Service", "Project Service"
}

export interface NotificationCardProps {
  notification: Notification;
  onClick?: (id: number) => void;
  className?: string;
}