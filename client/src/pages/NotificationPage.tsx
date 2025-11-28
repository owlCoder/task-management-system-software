import React, { useState } from 'react';
import NotificationNavigationBar from '../components/notification/NotificationNavigationBar';
import NotificationHeader from '../components/notification/NotificationHeader';
import NotificationFilters from '../components/notification/NotificationFilters';
import NotificationCard   from '../components/notification/NotificationCard';
import type { Notification } from '../models/notification/NotificationCardDTO';

const NotificationPage: React.FC = () => {
  
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  // trenutno koristimo samo neke mock podatke
  // kasnije ovde ce ici drugaciji nacin poziva podataka
  const allNotifications: Notification[] = [
    {
      id: 1,
      content: "Content of notification 1",
      timestamp: "18/11/2025, 22:50",
      isRead: false,
      type: 'info'
    },
    {
      id: 2,
      content: "Content of notification 2",
      timestamp: "18/11/2025, 23:50",
      isRead: false,
      type: 'warning'
    },
    {
      id: 3,
      content: "Content of notification 3",
      timestamp: "19/11/2025, 00:50",
      isRead: true,
      type: 'error'
    },
    {
      id: 4,
      content: "Content of notification 4",
      timestamp: "19/11/2025, 01:50",
      isRead: true,
      type: 'info'
    },
    {
      id: 5,
      content: "Content of notification 5",
      timestamp: "19/11/2025, 02:50",
      isRead: false,
      type: 'warning'
    },
    {
      id: 6,
      content: "Content of notification 6",
      timestamp: "19/11/2025, 03:50",
      isRead: true,
      type: 'info'
    },
    {
      id: 7,
      content: "Content of notification 7",
      timestamp: "19/11/2025, 04:50",
      isRead: false,
      type: 'error'
    },
    {
      id: 8,
      content: "Content of notification 8",
      timestamp: "19/11/2025, 05:50",
      isRead: true,
      type: 'warning'
    }
  ];

  // filtriraj podatke po odabranom filteru
  // ako odaberemo unread onda ostaju neprocitane
  // ako odaberemo sve, onda imamo sve
  const filteredNotifications = activeFilter === 'unread' 
    ? allNotifications.filter(notification => !notification.isRead)
    : allNotifications;

  // prebroj totalni broj neprocitanih notifikacija
  // brojac mali za neprocitane notifikacije
  const unreadCount = allNotifications.filter(
    notification => !notification.isRead
  ).length;