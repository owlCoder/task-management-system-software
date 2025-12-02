import React from 'react';
import { NotificationNavigationBarProps } from '../../models/notification/NotificationNavigationBarDTO';

const NotificationNavigationBar: React.FC<NotificationNavigationBarProps> = ({
  username = "Username",
  role = "Role",
  className = ""
}) => {
  return (
    <nav className={`bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_25px_rgba(0,0,0,0.25)] px-6 py-4 ml-4 ${className}`}>
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <h2 className="text-2xl font-bold text-white">A2-Pictures</h2>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-white">{username}</div>
            <div className="text-xs text-white/70">{role}</div>
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default NotificationNavigationBar;