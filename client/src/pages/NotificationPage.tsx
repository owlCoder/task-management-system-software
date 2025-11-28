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

// funkcija za obradu promene filtera
  // kada korisnik izabere all ili unread
  const handleFilterChange = (filter: 'all' | 'unread') => {
    console.log(`Filter changed to: ${filter}`);
    setActiveFilter(filter);
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
    // prosiruje stranicu za slanje podataka doradi ovo
  };

  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* gornja navigaciona traka */}
      <NotificationNavigationBar 
        username="John Doe"
        role="Project Manager"
      />

      {/* Glavni sadrzaj */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* naslov i send dugme */}
        <NotificationHeader 
          onSendClick={handleSendNotificationClick}
        />

        {/* filteri */}
        <div className="mb-6">
          <NotificationFilters
            activeFilter={activeFilter}
            unreadCount={unreadCount}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* lista obavestenja */}
        <div className="space-y-4">
          
          {/* proverava da li postoje obavestenja za prikaz */}
          {filteredNotifications.length === 0 ? (
            
            /* kada nema notifikacija neka prikaze samo prazno stanje */
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
            
            /* prolazi kroz filtrirana obavestenja */
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default NotificationPage;

  