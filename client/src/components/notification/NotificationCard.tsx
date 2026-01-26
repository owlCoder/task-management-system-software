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
          ? 'border-blue-500/50 bg-slate-800/80' 
          : 'border-white/10 bg-slate-900/60 hover:border-white/20'
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
            className="w-5 h-5 rounded border-white/20 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition"
          />
        </div>

        {/* content - sredina */}
        <div className="flex-1">
          <h3 className={`font-bold text-lg transition break-words ${
            isSelected ? 'text-slate-50' : 'text-slate-100'
          }`}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            {notification.title}
          </h3>

          <p className={`mt-2 text-sm leading-relaxed transition break-words overflow-wrap-anywhere ${
            isSelected ? 'text-slate-300' : 'text-slate-400'
          }`}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            {notification.content}
          </p>

          <div className={`mt-3 text-xs transition ${
            isSelected ? 'text-slate-400' : 'text-slate-500'
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