import React from 'react';

interface NotificationTitleProps {
  className?: string;
}

const NotificationTitle: React.FC<NotificationTitleProps> = ({ className = "" }) => {
  return (
    <h1 className={`text-3xl font-bold text-slate-100 ${className}`}>
      Notifications
    </h1>
  );
};

export default NotificationTitle;