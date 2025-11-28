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
        <div className="flex items-center gap-8">
          <h2 className="text-2xl font-bold text-slate-100">A2-Pictures</h2>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition">
              Projects
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition">
              Tasks
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition">
              Files
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-700 text-slate-100 border border-white/20 transition">
              Notifications
            </button>
          </div>
        </div>

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