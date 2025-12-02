import React from 'react';

import { NotificationSidebarProps } from '../../models/notification/NotificationSidebarDTO';

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ 
  className = "" 
}) => {
  return (
    <aside className={`w-48 bg-slate-900/40 border-r border-white/10 p-4 ${className}`}>
      <div className="space-y-3">
        
        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 bg-slate-800/50 border border-white/10 hover:border-white/20 hover:text-slate-100 transition text-left">
          Projects
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 bg-slate-800/50 border border-white/10 hover:border-white/20 hover:text-slate-100 transition text-left">
          Tasks
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 bg-slate-800/50 border border-white/10 hover:border-white/20 hover:text-slate-100 transition text-left">
          Files
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-slate-700 text-slate-100 border border-white/20 transition text-left">
          Notifications
        </button>

      </div>
    </aside>
  );
};

export default NotificationSidebar;