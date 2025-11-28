import React from 'react';
import type { NotificationCardProps } from '../../models/notification/NotificationCardDTO';

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onClick, 
  className = "" 
}) => {
  return (
    <article
      className={`rounded-xl border border-white/10 bg-slate-900/60 p-5 hover:border-white/20 transition ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={() => onClick?.(notification.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-slate-100 font-bold text-lg">
            Notification {notification.id}
          </h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {notification.content}
          </p>
          <div className="mt-3 text-xs text-slate-500">
            {notification.timestamp}
          </div>
        </div>
        
        {!notification.isRead && (
          <div className="ml-4 mt-1">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          </div>
        )}
      </div>
    </article>
  );
};

export default NotificationCard;