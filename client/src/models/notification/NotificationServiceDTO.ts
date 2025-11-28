export interface NotificationResponse {
  id: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'error';
  source: string;
  userId: number;
  createdAt: string;
}

export interface NotificationQueryParams {
  filter?: 'all' | 'unread';
  page?: number;
  limit?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
}