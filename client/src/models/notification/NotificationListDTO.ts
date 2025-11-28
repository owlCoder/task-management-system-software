export interface NotificationListProps {
  notifications: Notification[];
  displayedCount: number;
  onLoadMore?: () => void;
  hasMore: boolean;
  loading: boolean;
  initialLoading?: boolean;
  onNotificationClick?: (id: number) => void;
  className?: string;
}