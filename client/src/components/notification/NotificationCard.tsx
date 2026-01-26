import React from 'react';
import type { NotificationCardProps } from '../../models/notification/NotificationCardDTO';

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
  isSelected = false,
  onSelectChange,
  className = ""
}) => {
  
  // handler za checkbox - sprecava propagaciju klika na celu karticu
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCheckboxChange = () => {
    if (onSelectChange) {
      onSelectChange(notification.id);
    }
  };

  // handler za klik na celu karticu - toggle-uje selekciju
  const handleCardClick = () => {
    if (onSelectChange) {
      onSelectChange(notification.id);
    }
  };

  return (
    <article
      className={`rounded-xl border transition ${
        isSelected 
          ? 'border-[var(--palette-medium-blue)]/40 bg-white/15' 
          : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
      } p-5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-4">
        
        {/* checkbox - levo */}
        <div className="flex items-start pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={handleCheckboxClick}
            className="w-5 h-5 rounded border-white/30 bg-white/10 text-[var(--palette-medium-blue)] focus:ring-[var(--palette-medium-blue)] focus:ring-offset-0 cursor-pointer transition"
          />
        </div>

        {/* content - sredina */}
        <div className="flex-1">
          <h3 className={`font-bold text-lg transition break-words ${
            isSelected ? 'text-white' : 'text-white/90'
          }`}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            {notification.title}
          </h3>

          <p className={`mt-2 text-sm leading-relaxed transition break-words overflow-wrap-anywhere ${
            isSelected ? 'text-white/70' : 'text-white/60'
          }`}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            {notification.content}
          </p>

          <div className={`mt-3 text-xs transition ${
            isSelected ? 'text-white/60' : 'text-white/50'
          }`}>
            {new Date(notification.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        
        {/* unread dot - desno */}
        {!notification.isRead && (
          <div className="flex items-start pt-1">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          </div>
        )}
        
      </div>
    </article>
  );
};

export default NotificationCard;
