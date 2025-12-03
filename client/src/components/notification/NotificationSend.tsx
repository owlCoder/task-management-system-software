import React from 'react';

import { SendNotificationProps } from '../../models/notification/NotificationSendDTO';

const SendNotification: React.FC<SendNotificationProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg font-semibold text-sm bg-slate-900/50 text-slate-300 border border-white/10 hover:bg-slate-800/60 hover:border-white/20 hover:text-slate-100 transition flex items-center gap-2 cursor-pointer ${className}`}
    >
      <span className="text-lg">+</span>
      Send Notification
    </button>
  );
};

export default SendNotification;