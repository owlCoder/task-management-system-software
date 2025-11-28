import React from 'react';

import { NotificationTitleProps } from '../../models/notification/NotificationTitlePropsDTO';

const NotificationTitle: React.FC<NotificationTitleProps> = ({ className = "" }) => {
  return (
    <h1 className={`text-3xl font-bold text-slate-100 ${className}`}>
      Notifications
    </h1>
  );
};

export default NotificationTitle;