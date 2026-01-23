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
import { socketManager } from "./api/notification/socketInstance";
import { useAuth } from "./hooks/useAuthHook";
import { INotificationAPI } from "./api/notification/INotificationAPI";
import { NotificationAPI } from "./api/notification/NotificationAPI";
import ProjectSprintsPage from "./pages/ProjectSprintPage";

const auth_api: IAuthAPI = new AuthAPI();
const notification_API: INotificationAPI = new NotificationAPI(import.meta.env.VITE_GATEWAY_URL);

const backgroundImageUrl = new URL("../public/bg2.png", import.meta.url).href;

function App() {
  const { user, isAuthenticated } = useAuth();
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
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/projects/:projectId/sprints" element={<ProjectSprintsPage />} />
        <Route path="/projects/:projectId/sprints/:sprintId/tasks" element={<TaskPage />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
