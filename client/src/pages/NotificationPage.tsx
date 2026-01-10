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
import toast from "react-hot-toast";

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

      const count = selectedNotifications.length;
      setSelectedNotifications([]);
      setIsAllSelected(false);

      toast.success(`${count} notification${count === 1 ? '' : 's'} marked as read`);
    } catch (err: any) {
      console.error(" Frontend handleMarkAsRead error:", err);
      toast.error(
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

      const count = selectedNotifications.length;
      setSelectedNotifications([]);
      setIsAllSelected(false);

      toast.success(`${count} notification${count === 1 ? '' : 's'} marked as unread`);
    } catch (err: any) {
      console.error(" Frontend handleMarkAsUnread error:", err);
      toast.error(
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

      const deletedCount = selectedNotifications.length;
      setSelectedNotifications([]);
      setIsAllSelected(false);

      toast.success(`${deletedCount} notification${deletedCount === 1 ? '' : 's'} deleted successfully`);
    } catch (err: any) {
      console.error(" Frontend handleDeleteSelected error:", err);
      toast.error(
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

      const newNotifications = await notificationAPI.createNotification({
        title,
        content,
        type,
        userIds: [currentUserId],
      });

      // Odmah dodaj nove notifikacije u listu (optimistic update)
      setAllNotifications([...newNotifications, ...allNotifications]);

      setIsPopUpOpen(false);

      // Toast success poruka
      toast.success("Notification created successfully!");
    } catch (err) {
      console.error("Error sending notification:", err);
      toast.error("Failed to create notification");
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading notifications...</div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-red-400 text-xl">{error}</div>
          <button
            onClick={loadNotifications}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black overflow-hidden">
      <Sidebar />

      <div className="flex-1 p-6 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          <NotificationHeader onSendClick={handleSendNotificationClick} />
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 mb-6">
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

        {/* Notification List*/}
        <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2 styled-scrollbar">
            <div className="space-y-4">
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

        <NotificationSendPopUp
          isOpen={isPopUpOpen}
          onClose={() => setIsPopUpOpen(false)}
          onSend={handleSendNotification}
        />
      </div>
    </div>
  );
};

export default NotificationPage;
