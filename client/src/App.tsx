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

const auth_api: IAuthAPI = new AuthAPI();

const backgroundImageUrl = new URL("../public/bg2.png", import.meta.url).href;

function App() {
  return (
    <div
      className="h-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/tasks" element={<TaskPage projectId={""}  />} />
        <Route path="/auth" element={<AuthPage authAPI={auth_api} />} />
        <Route path="/files" element={<FilePage />} />
        <Route path="/mainwindow" element={<MainWindow />} />
        <Route path="/" element={<AuthPage authAPI={auth_api} />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
