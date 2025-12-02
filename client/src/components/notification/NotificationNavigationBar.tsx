import React from 'react';
import { NotificationNavigationBarProps } from '../../models/notification/NotificationNavigationBarDTO';

const NotificationNavigationBar: React.FC<NotificationNavigationBarProps> = ({
  username = "Username",
  role = "Role",
  className = ""
}) => {
  return (
    <nav className={`bg-slate-900/60 border-b border-white/10 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <h2 className="text-2xl font-bold text-slate-100">A2-Pictures</h2>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-100">{username}</div>
            <div className="text-xs text-slate-400">{role}</div>
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default NotificationNavigationBar;