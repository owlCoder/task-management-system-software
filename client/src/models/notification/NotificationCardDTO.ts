
export interface Notification {
  id: number;
  title: string;           
  content: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  userId: number;         
  createdAt: string;      
  updatedAt: string;       
}

export interface NotificationCardProps {
  notification: Notification;
  onClick?: (id: number) => void;
  isSelected?: boolean;
  onSelectChange?: (id: number) => void;
  className?: string;
}