export interface NotificationFilter {
  label: string;
  value: 'all' | 'unread';
  count?: number;
}

export interface NotificationFiltersProps {
  activeFilter: 'all' | 'unread';
  unreadCount: number;
  onFilterChange: (filter: 'all' | 'unread') => void;
  className?: string;
}