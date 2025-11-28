import React from 'react';
import NotificationTitle from './NotificationTitle';
import SendNotification from './NotificationSend';
import { NotificationHeaderProps } from '../../models/notification/NotificationHeaderDTO';

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onSendClick,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <NotificationTitle />
      <SendNotification onClick={onSendClick} />
    </div>
  );
};

export default NotificationHeader;