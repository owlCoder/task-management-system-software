import React from 'react';

import { SendNotificationProps } from '../../models/notification/NotificationSendDTO';

const SendNotification: React.FC<SendNotificationProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 h-10 px-5 min-w-[170px] rounded-lg font-semibold text-sm transition-all duration-200 border whitespace-nowrap bg-white/10 text-white/70 border-white/15 backdrop-blur-xl hover:bg-white/20 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10 cursor-pointer ${className}`}
    >
      <span className="text-lg">+</span>
      Send Notification
    </button>
  );
};

export default SendNotification;
