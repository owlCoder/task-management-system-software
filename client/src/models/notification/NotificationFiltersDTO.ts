export interface NotificationFilter {
  label: string;
  value: 'all' | 'unread';
  count?: number;
}

export interface SortOption {
  label: string;
  value: 'newest' | 'oldest' | 'unread' | 'read';
}

export interface NotificationFiltersProps {
  activeFilter: 'all' | 'unread';
  unreadCount: number;
  onFilterChange: (filter: 'all' | 'unread') => void;
  sortBy: 'newest' | 'oldest' | 'unread' | 'read';
  onSortChange: (sort: 'newest' | 'oldest' | 'unread' | 'read') => void;
  isAllSelected: boolean;
  onSelectAll: () => void;
  selectedCount: number;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onDeleteSelected: () => void;
  hasUnreadSelected: boolean;
  hasReadSelected: boolean;
  unreadSelectedCount: number;
  readSelectedCount: number;
  className?: string;
}