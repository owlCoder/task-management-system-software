import React from 'react';
import NotificationTitle from './NotificationTitle';
import { NotificationHeaderProps } from '../../models/notification/NotificationHeaderDTO';

const NotificationHeader: React.FC<NotificationHeaderProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-between mb-6 ml-8 ${className}`}>
      <NotificationTitle />
    </div>
  );
};

export default NotificationHeader;
