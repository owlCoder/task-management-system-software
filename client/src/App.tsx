import { useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { IAuthAPI } from "./api/auth/IAuthAPI";
import { AuthAPI } from "./api/auth/AuthAPI";
import ProjectsPage from "./pages/ProjectsPage";
import MainWindow from "./pages/MainWindow";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import UserPage from "./pages/UserPage";
import NotificationPage from "./pages/NotificationPage";
import TaskPage from "./pages/TaskPage";
import { FilePage } from "./pages/FilePage";
import { OtpPage } from "./pages/OTPPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";
import { socketEventService, socketManager } from "./api/notification/socketInstance";
import { useAuth } from "./hooks/useAuthHook";
import { INotificationAPI } from "./api/notification/INotificationAPI";
import { NotificationAPI } from "./api/notification/NotificationAPI";
import ReviewInboxPage from "./pages/ReviewInboxPage";
import StatusesPage from "./pages/StatusesPage";
import ProjectSprintsPage from "./pages/ProjectSprintPage";
import { sprintAPI } from "./api/sprint/SprintAPI";
import { SocketEvents } from "./constants/SocketEvents";
import type { Notification } from "./models/notification/NotificationCardDTO";

const auth_api: IAuthAPI = new AuthAPI();
const notification_API: INotificationAPI = new NotificationAPI(import.meta.env.VITE_GATEWAY_URL);

const backgroundImageUrl = new URL("../public/bg2.png", import.meta.url).href;

function App() {
  const { user, isAuthenticated, token } = useAuth();
  const socketInitialized = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user?.id && !socketInitialized.current) {
      socketInitialized.current = true;
      socketManager.connect();
      socketManager.joinUserRoom(user.id);
    }

    return () => {
      if (!isAuthenticated && socketInitialized.current) {
        socketManager.leaveUserRoom(user?.id || 0);
        socketManager.disconnect();
        socketInitialized.current = false;
      }
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const lastSeenKey = `notifications:lastSeen:${user.id}`;

    const handleNotification = (notification: Notification) => {
      toast.success(notification.title || "You have a new notification");
      if (notification.createdAt) {
        localStorage.setItem(lastSeenKey, notification.createdAt);
      }
    };

    socketEventService.onNotificationCreated(handleNotification);

    return () => {
      socketEventService.removeListener(SocketEvents.NOTIFICATION_CREATED);
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !token) return;

    const lastSeenKey = `notifications:lastSeen:${user.id}`;
    const lastSeen = localStorage.getItem(lastSeenKey);

    if (!lastSeen) {
      localStorage.setItem(lastSeenKey, new Date().toISOString());
      return;
    }

    const lastSeenTime = new Date(lastSeen).getTime();

    const checkLatestNotification = async () => {
      try {
        const notifications = await notification_API.getNotificationsByUserId(token, user.id);
        const newOnes = notifications.filter((n) => new Date(n.createdAt).getTime() > lastSeenTime);

        if (newOnes.length > 0) {
          toast.success("You have a new notification");
          const newest = newOnes
            .map((n) => new Date(n.createdAt).getTime())
            .reduce((a, b) => Math.max(a, b), lastSeenTime);
          localStorage.setItem(lastSeenKey, new Date(newest).toISOString());
        }
      } catch (err) {
        console.error("Failed to check notifications:", err);
      }
    };

    checkLatestNotification();
  }, [isAuthenticated, user?.id, token]);

  return (
    <div
      className="h-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/notifications" element={<NotificationPage notificationAPI={notification_API} />} />
        <Route path="/auth" element={<AuthPage authAPI={auth_api} />} />
        <Route path="/files" element={<FilePage />} />
        <Route path="/mainwindow" element={<MainWindow />} />
        <Route path="/" element={<AuthPage authAPI={auth_api} />} />
        <Route path="/otp" element={<OtpPage authAPI={auth_api} />} />
        <Route path="/reviews" element={<ReviewInboxPage />} />
        <Route path="/projects/:projectId/sprints" element={<ProjectSprintsPage sprintAPI={sprintAPI} />}/>
        <Route path="/projects/:projectId/sprints/:sprintId/tasks" element={<TaskPage />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route path="/statuses" element={<StatusesPage />} />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
