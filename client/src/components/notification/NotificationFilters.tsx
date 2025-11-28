import React from 'react';
import type { NotificationFiltersProps } from '../../models/notification/NotificationFiltersDTO';

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  unreadCount,
  onFilterChange,
  className = ""
}) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      <button
        onClick={() => onFilterChange('all')}
        className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${
          activeFilter === 'all'
            ? 'bg-slate-700 text-slate-100 border border-white/20'
            : 'bg-slate-900/50 text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-300'
        }`}
      >
        All
      </button>
      
      <button
        onClick={() => onFilterChange('unread')}
        className={`px-6 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
          activeFilter === 'unread'
            ? 'bg-slate-700 text-slate-100 border border-white/20'
            : 'bg-slate-900/50 text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-300'
        }`}
      >
        Unread
        {unreadCount > 0 && (
          <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationFilters;