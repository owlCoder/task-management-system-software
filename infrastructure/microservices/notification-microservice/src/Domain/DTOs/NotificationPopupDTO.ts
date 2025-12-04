export interface NotificationPopupDTO {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  targetUsers?: number[]; 
  createdAt?: string;
}