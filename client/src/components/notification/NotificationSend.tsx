import React from 'react';

interface SendNotificationProps {
  onClick?: () => void;
  className?: string;
}

const SendNotification: React.FC<SendNotificationProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg font-semibold text-sm bg-slate-700 text-slate-100 border border-white/20 hover:bg-slate-600 transition flex items-center gap-2 ${className}`}
    >
      <span className="text-lg">+</span>
      Send Notification
    </button>
  );
};

export default NotificationSend;