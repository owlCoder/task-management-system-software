import React, { useState } from 'react';
import NotificationNavigationBar from '../components/notification/NotificationNavigationBar';
import NotificationSidebar from '../components/notification/NotificationSidebar';
import NotificationHeader from '../components/notification/NotificationHeader';
import NotificationFilters from '../components/notification/NotificationFilters';
import NotificationCard from '../components/notification/NotificationCard';
import NotificationSendPopUp from '../components/notification/NotificationSendPopUp';
import type { Notification } from '../models/notification/NotificationCardDTO';

const NotificationPage: React.FC = () => {
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'unread' | 'read'>('newest');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

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

  // funkcija za obradu promene filtera
  // kada korisnik izabere all ili unread
  const handleFilterChange = (filter: 'all' | 'unread') => {
    console.log(`Filter changed to: ${filter}`);
    setActiveFilter(filter);
  };

  // funkcija za promenu sort-a
  const handleSortChange = (sort: 'newest' | 'oldest' | 'unread' | 'read') => {
    console.log(`Sort changed to: ${sort}`);
    setSortBy(sort);
    // TODO: Implementirati logiku za sortiranje
  };

  // funkcija za select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNotifications([]);
      setIsAllSelected(false);
    } else {
      const allIds = filteredNotifications.map(n => n.id);
      setSelectedNotifications(allIds);
      setIsAllSelected(true);
    }
  };

  // funkcija za promenu selekcije pojedinacne notifikacije
  const handleSelectChange = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(nId => nId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  // funkcija za mark as read
  const handleMarkAsRead = () => {
    console.log(`Marking as read: ${selectedNotifications}`);
    // TODO: Implementirati logiku za oznacavanje kao procitano
    setSelectedNotifications([]);
    setIsAllSelected(false);
  };

  // funkcija za mark as unread
  const handleMarkAsUnread = () => {
    console.log(`Marking as unread: ${selectedNotifications}`);
    // TODO: Implementirati logiku za oznacavanje kao neprocitano
    setSelectedNotifications([]);
    setIsAllSelected(false);
  };

  // funkcija za delete selected
  const handleDeleteSelected = () => {
    console.log(`Deleting: ${selectedNotifications}`);
    // TODO: Implementirati logiku za brisanje
    setSelectedNotifications([]);
    setIsAllSelected(false);
  };

  // obrada klika na funkciju kada korisnik izabere neku od notifikacija
  const handleNotificationClick = (id: number) => {
    console.log(`Notification with ID ${id} was clicked`);
    // ovde treba da se oznaci kao procitana
    // ili da predje na stranicu sa daljim detaljima o notifikaciji
  };

  // funkcija za klik za slanje notifikacije '+ Send Notification' dugme 
  const handleSendNotificationClick = () => {
    console.log('Send notification button was clicked');
    setIsPopUpOpen(true);
  };

  // funkcija za slanje notifikacije iz popup-a
  const handleSendNotification = (title: string, content: string) => {
    console.log('Sending notification:', { title, content });
    // TODO: Implementirati API poziv za slanje notifikacije
    setIsPopUpOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      
      {/* Sidebar - Full Height */}
      <NotificationSidebar />

      {/* Right Side - Navigation + Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Navigation Bar */}
        <NotificationNavigationBar 
          username="John Doe"
          role="Project Manager"
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            
            {/* Header */}
            <NotificationHeader 
              onSendClick={handleSendNotificationClick}
            />

            {/* Filters */}
            <div className="mb-6">
              <NotificationFilters
                activeFilter={activeFilter}
                unreadCount={unreadCount}
                onFilterChange={handleFilterChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                isAllSelected={isAllSelected}
                onSelectAll={handleSelectAll}
                selectedCount={selectedNotifications.length}
                onMarkAsRead={handleMarkAsRead}
                onMarkAsUnread={handleMarkAsUnread}
                onDeleteSelected={handleDeleteSelected}
              />
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              
              {filteredNotifications.length === 0 ? (
                
                <div className="text-center py-16">
                  <div className="mb-4">
                    <p className="text-slate-400 text-lg font-semibold">
                      No notifications to display
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">
                      {activeFilter === 'unread' 
                        ? 'You have no unread notifications' 
                        : 'No notifications available'}
                    </p>
                  </div>
                </div>

              ) : (
                
                filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                    isSelected={selectedNotifications.includes(notification.id)}
                    onSelectChange={handleSelectChange}
                  />
                ))

              )}

            </div>

          </div>
        </div>

      </div>

      {/* Popup */}
      <NotificationSendPopUp
        isOpen={isPopUpOpen}
        onClose={() => setIsPopUpOpen(false)}
        onSend={handleSendNotification}
      />

    </div>
  );
};

export default NotificationPage;