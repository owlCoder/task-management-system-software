import React from 'react';

import type { NotificationSidebarProps } from '../../models/notification/NotificationSidebarDTO';

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ 
  className = "" 
}) => {
  return (
    <aside className={`w-48 min-h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-[4px_0_25px_rgba(0,0,0,0.25)] p-4 pt-24 ${className}`}>
      <div className="w-full space-y-4">
        
        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center">
          Projects
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center">
          Tasks
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center">
          Files
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-white/20 text-white border border-white/30 transition text-center">
          Notifications
        </button>

      </div>
    </aside>
  );
};

export default NotificationSidebar;