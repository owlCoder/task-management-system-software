import React, { useState } from 'react';
import type { NotificationFiltersProps } from '../../models/notification/NotificationFiltersDTO';

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  unreadCount,
  onFilterChange,
  sortBy,
  onSortChange,
  isAllSelected,
  onSelectAll,
  selectedCount,
  onMarkAsRead,
  onMarkAsUnread,
  onDeleteSelected,
  className = ""
}) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const sortOptions = [
    { label: 'Newest First', value: 'newest' as const },
    { label: 'Oldest First', value: 'oldest' as const },
    { label: 'Unread First', value: 'unread' as const },
    { label: 'Read First', value: 'read' as const }
  ];

  const handleSortSelect = (value: 'newest' | 'oldest' | 'unread' | 'read') => {
    onSortChange(value);
    setIsSortDropdownOpen(false);
  };

  const getCurrentSortLabel = () => {
    return sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort By';
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      
      {/* filter all and unread */}
      <div className="flex gap-3">
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

      {/* right side - sort, select all, mark as read/unread, delete */}
      <div className="flex items-center gap-3">
        
        {/* sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="px-5 py-2 rounded-lg font-semibold text-sm bg-slate-900/50 text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-300 transition flex items-center gap-2"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" 
              />
            </svg>
            {getCurrentSortLabel()}
            <svg 
              className={`w-4 h-4 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </button>

          {/* dropdown menu */}
          {isSortDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  className={`w-full px-4 py-2 text-left text-sm font-medium transition hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg ${
                    sortBy === option.value
                      ? 'text-blue-400 bg-slate-700/50'
                      : 'text-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* select all checkbox */}
        <button
          onClick={onSelectAll}
          className="px-5 py-2 rounded-lg font-semibold text-sm bg-slate-900/50 text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-300 transition flex items-center gap-2"
        >
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={() => {}}
            className="w-4 h-4 rounded border-white/20 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          Select All
        </button>

        {/* mark as read */}
        <button
          onClick={onMarkAsRead}
          disabled={selectedCount === 0}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
            selectedCount > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500'
              : 'bg-slate-900/50 text-slate-600 border border-white/10 cursor-not-allowed'
          }`}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Mark as Read
        </button>

        {/* mark as unread */}
        <button
          onClick={onMarkAsUnread}
          disabled={selectedCount === 0}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
            selectedCount > 0
              ? 'bg-amber-600 text-white hover:bg-amber-700 border border-amber-500'
              : 'bg-slate-900/50 text-slate-600 border border-white/10 cursor-not-allowed'
          }`}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" 
            />
          </svg>
          Mark as Unread
        </button>

        {/* delete */}
        <button
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
            selectedCount > 0
              ? 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-500'
              : 'bg-slate-900/50 text-slate-600 border border-white/10 cursor-not-allowed'
          }`}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
          Delete
          {selectedCount > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </button>

      </div>

    </div>
  );
};

export default NotificationFilters;