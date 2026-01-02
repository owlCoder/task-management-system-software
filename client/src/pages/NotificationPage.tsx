import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import NotificationHeader from "../components/notification/NotificationHeader";
import NotificationFilters from "../components/notification/NotificationFilters";
import NotificationCard from "../components/notification/NotificationCard";
import NotificationSendPopUp from "../components/notification/NotificationSendPopUp";
import type { Notification } from "../models/notification/NotificationCardDTO";
import { NotificationType } from "../enums/NotificationType";
import { notificationAPI } from "../api/notification/NotificationAPI";
import { socketManager, socketEventService } from "../api/notification/socketInstance";

const backgroundImageUrl = "/background.png";

const NotificationPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "unread" | "read">(
    "newest"
  );
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    []
  );
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  // STATE ZA NOTIFIKACIJE IZ BACKEND-A
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Zamijeniti sa pravim userId-em iz auth contexta
  const currentUserId = 1;

  // UCITAJ NOTIFIKACIJE SA BACKEND-A I KONEKTUJ WEBSOCKET
  useEffect(() => {
    loadNotifications();
    setupWebSocket();

    // Cleanup na unmount
    return () => {
      socketManager.leaveUserRoom(currentUserId);
      socketManager.disconnect();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const notifications = await notificationAPI.getNotificationsByUserId(
        currentUserId
      );
      setAllNotifications(notifications);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    // Konektuj WebSocket
    socketManager.connect();

    // Pridruži se user room-u
    socketManager.joinUserRoom(currentUserId);

    // NOTIFICATION CREATED - Nova notifikacija
    socketEventService.onNotificationCreated((notification: Notification) => {
      console.log(" New notification received:", notification);
      setAllNotifications((prev) => [notification, ...prev]);
    });

    // NOTIFICATION DELETED - Obrisana notifikacija
    socketEventService.onNotificationDeleted((data: { id: number }) => {
      console.log(" Notification deleted:", data.id);
      setAllNotifications((prev) => prev.filter((n) => n.id !== data.id));
    });

    // NOTIFICATION MARKED READ - Označena kao pročitana
    socketEventService.onNotificationMarkedRead((notification: Notification) => {
      console.log(" Notification marked as read:", notification.id);
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    });

    // NOTIFICATION MARKED UNREAD - Označena kao nepročitana
    socketEventService.onNotificationMarkedUnread((notification: Notification) => {
      console.log(" Notification marked as unread:", notification.id);
      setAllNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: false } : n
        )
      );
    });

    // BULK DELETED - Više notifikacija obrisano
    socketEventService.onNotificationsBulkDeleted((data: { ids: number[] }) => {
      console.log(" Bulk delete:", data.ids);
      setAllNotifications((prev) =>
        prev.filter((n) => !data.ids.includes(n.id))
      );
    });

    // BULK MARKED READ - Više notifikacija označeno kao pročitano
    socketEventService.onNotificationsBulkMarkedRead((data: { ids: number[] }) => {
      console.log(" Bulk marked as read:", data.ids);
      setAllNotifications((prev) =>
        prev.map((n) => (data.ids.includes(n.id) ? { ...n, isRead: true } : n))
      );
    });

    // BULK MARKED UNREAD - Više notifikacija označeno kao nepročitano
    socketEventService.onNotificationsBulkMarkedUnread((data: { ids: number[] }) => {
      console.log(" Bulk marked as unread:", data.ids);
      setAllNotifications((prev) =>
        prev.map((n) => (data.ids.includes(n.id) ? { ...n, isRead: false } : n))
      );
    });
  };

  // filtriraj podatke po odabranom filteru
  const filtered =
    activeFilter === "unread"
      ? allNotifications.filter((notification) => !notification.isRead)
      : allNotifications;

  // sortiraj notifikacije na osnovu sortBy
  const filteredNotifications = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        // Sortiraj od najnovijeg ka najstarijem (pretpostavljam da veci ID = noviji)
        return b.id - a.id;
      case "oldest":
        // Sortiraj od najstarijeg ka najnovijem
        return a.id - b.id;
      case "unread":
        // Neprocitane prvo, zatim procitane
        if (a.isRead === b.isRead) return b.id - a.id;
        return a.isRead ? 1 : -1;
      case "read":
        // Procitane prvo, zatim neprocitane
        if (a.isRead === b.isRead) return b.id - a.id;
        return a.isRead ? -1 : 1;
      default:
        return 0;
    }
  });

  // prebroj totalni broj neprocitanih notifikacija
  const unreadCount = allNotifications.filter(
    (notification) => !notification.isRead
  ).length;

  // funkcija za obradu promene filtera
  const handleFilterChange = (filter: "all" | "unread") => {
    console.log(`Filter changed to: ${filter}`);
    setActiveFilter(filter);
  };

  // funkcija za promenu sort-a
  const handleSortChange = (sort: "newest" | "oldest" | "unread" | "read") => {
    console.log(`Sort changed to: ${sort}`);
    setSortBy(sort);
  };

  // funkcija za select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNotifications([]);
      setIsAllSelected(false);
    } else {
      const allIds = filteredNotifications.map((n) => n.id);
      setSelectedNotifications(allIds);
      setIsAllSelected(true);
    }
  };

  // funkcija za promenu selekcije pojedinacne notifikacije
  const handleSelectChange = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(
        selectedNotifications.filter((nId) => nId !== id)
      );
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  // funkcija za mark as read
  const handleMarkAsRead = async () => {
    try {
      await notificationAPI.markMultipleAsRead(selectedNotifications);

      // WebSocket će automatski ažurirati state!
      setAllNotifications(
        allNotifications.map((n) =>
          selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n
        )
      );

      setSelectedNotifications([]);
      setIsAllSelected(false);
    } catch (err: any) {
      console.error(" Frontend handleMarkAsRead error:", err);
      alert(
        `Failed to mark notifications as read: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // funkcija za mark as unread
  const handleMarkAsUnread = async () => {
    try {
      await notificationAPI.markMultipleAsUnread(selectedNotifications);

      // WebSocket ce automatski azurirati state!
      setAllNotifications(
        allNotifications.map((n) =>
          selectedNotifications.includes(n.id) ? { ...n, isRead: false } : n
        )
      );

      setSelectedNotifications([]);
      setIsAllSelected(false);
    } catch (err: any) {
      console.error(" Frontend handleMarkAsUnread error:", err);
      alert(
        `Failed to mark notifications as unread: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // funkcija za delete selected
  const handleDeleteSelected = async () => {
    try {
      await notificationAPI.deleteMultipleNotifications(selectedNotifications);

      // WebSocket ce automatski azurirati state!
      setAllNotifications(
        allNotifications.filter((n) => !selectedNotifications.includes(n.id))
      );

      setSelectedNotifications([]);
      setIsAllSelected(false);
    } catch (err: any) {
      console.error(" Frontend handleDeleteSelected error:", err);
      alert(
        `Failed to delete notifications: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // obrada klika na funkciju kada korisnik izabere neku od notifikacija
  const handleNotificationClick = async (id: number) => {
    try {
      console.log(`Notification with ID ${id} was clicked`);

      // OPTIMISTIC UPDATE - odmah promeni UI
      setAllNotifications(
        allNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      // Zatim pozovi API (WebSocket ce takodje emitovati event)
      await notificationAPI.markAsRead(id);
    } catch (err) {
      console.error("Error marking notification as read:", err);

      // ROLLBACK - vrati na neprocitano ako zakaze
      setAllNotifications(
        allNotifications.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    }
  };

  // funkcija za klik za slanje notifikacije '+ Send Notification' dugme
  const handleSendNotificationClick = () => {
    console.log("Send notification button was clicked");
    setIsPopUpOpen(true);
  };

  // funkcija za slanje notifikacije iz popup-a
  const handleSendNotification = async (
    title: string,
    content: string,
    type: NotificationType
  ) => {
    try {
      console.log("Sending notification:", { title, content, type });

      const newNotification = await notificationAPI.createNotification({
        title,
        content,
        type,
        userId: currentUserId,
      });

      // Odmah dodaj novu notifikaciju u listu (optimistic update)
      setAllNotifications([newNotification, ...allNotifications]);

      setIsPopUpOpen(false);
    } catch (err) {
      console.error("Error sending notification:", err);
      alert("Failed to send notification");
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-xl">Loading notifications...</p>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={loadNotifications}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="fixed left-0 top-0 h-screen z-40">
        <Sidebar
        //username="John Doe"       // baca gresku TO DO
        //role="Project Manager"
        />
      </div>

      <div className="ml-48 pl-8">
        <div className="fixed top-0 z-50" style={{ left: "224px", right: 0 }}>
        </div>

        <div className="pt-[50px]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <NotificationHeader onSendClick={handleSendNotificationClick} />

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

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
              <div
                className="space-y-4 overflow-y-auto pr-2"
                style={{ maxHeight: "calc(100vh - 300px)" }}
              >
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="mb-4">
                      <p className="text-slate-100 text-lg font-semibold">
                        No notifications to display
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm">
                        {activeFilter === "unread"
                          ? "You have no unread notifications"
                          : "No notifications available"}
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onClick={handleNotificationClick}
                      isSelected={selectedNotifications.includes(
                        notification.id
                      )}
                      onSelectChange={handleSelectChange}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationSendPopUp
        isOpen={isPopUpOpen}
        onClose={() => setIsPopUpOpen(false)}
        onSend={handleSendNotification}
      />
    </div>
  );
};

export default NotificationPage;
