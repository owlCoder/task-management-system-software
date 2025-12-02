import React from 'react';

interface NotificationSidebarProps {
  className?: string;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ 
  className = "" 
}) => {
  return (
    <aside className={`w-48 min-h-screen bg-slate-900/40 border-r border-white/10 p-4 flex items-top ${className}`}>
      <div className="w-full space-y-4">
        
        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 bg-slate-800/50 border border-white/10 hover:border-white/20 hover:text-slate-100 transition text-center">
          Projects
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 bg-slate-800/50 border border-white/10 hover:border-white/20 hover:text-slate-100 transition text-center">
          Tasks
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 bg-slate-800/50 border border-white/10 hover:border-white/20 hover:text-slate-100 transition text-center">
          Files
        </button>

        <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-slate-700 text-slate-100 border border-white/20 transition text-center">
          Notifications
        </button>

      </div>
    </aside>
  );
};

export default NotificationSidebar;