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

  const controlButtonBase =
    "relative inline-flex items-center justify-center gap-2 h-9 px-4 min-w-[120px] rounded-lg font-semibold text-xs transition-all duration-200 border whitespace-nowrap backdrop-blur-xl";
  const controlButtonActive =
    "bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] text-white border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20 cursor-pointer";
  const controlButtonIdle =
    "bg-white/10 text-white/70 border-white/15 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10 cursor-pointer";
  const controlButtonDisabled =
    "bg-white/5 text-white/30 border-white/10 cursor-not-allowed";

  return (
    <div className={`flex items-center justify-between ${className}`}>
      
      {/* filter all and unread */}
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`${controlButtonBase} ${
            activeFilter === 'all' ? controlButtonActive : controlButtonIdle
          }`}
        >
          All
        </button>
        
        <button
          onClick={() => onFilterChange('unread')}
          className={`${controlButtonBase} ${
            activeFilter === 'unread' ? controlButtonActive : controlButtonIdle
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold bg-rose-500 text-white flex items-center justify-center shadow">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* right side - sort, select all, mark as read/unread, delete */}
      <div className="flex items-center gap-2">
        
        {/* sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className={`${controlButtonBase} ${controlButtonIdle}`}
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
            <div className="absolute top-full right-0 mt-2 w-44 bg-white/10 backdrop-blur-xl border border-white/15 rounded-lg shadow-xl z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  className={`w-full px-4 py-2 text-left text-sm font-medium transition hover:bg-white/20 first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                    sortBy === option.value
                      ? 'text-white bg-white/20'
                      : 'text-white/70'
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
          className={`${controlButtonBase} ${controlButtonIdle}`}
        >
          <input
            type="checkbox"
            checked={isAllSelected}
            readOnly
            className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-[var(--palette-medium-blue)] focus:ring-[var(--palette-medium-blue)] focus:ring-offset-0 cursor-pointer pointer-events-none"
          />
          Select All
        </button>

        {/* mark as read */}
        <button
          onClick={onMarkAsRead}
          disabled={selectedCount === 0}
          className={`${controlButtonBase} ${
            selectedCount > 0 ? controlButtonActive : controlButtonDisabled
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
          className={`${controlButtonBase} ${
            selectedCount > 0 ? controlButtonActive : controlButtonDisabled
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
          {selectedCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold bg-rose-500 text-white flex items-center justify-center shadow">
              {selectedCount}
            </span>
          )}
        </button>

        {/* delete */}
        <button
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className={`${controlButtonBase} ${
            selectedCount > 0 ? controlButtonActive : controlButtonDisabled
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
            <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold bg-rose-500 text-white flex items-center justify-center shadow">
              {selectedCount}
            </span>
          )}
        </button>

      </div>

    </div>
  );
};

export default NotificationFilters;
