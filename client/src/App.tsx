import { Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { IAuthAPI } from "./api/auth/IAuthAPI";
import { AuthAPI } from "./api/auth/AuthAPI";
import { UserAPI } from "./api/users/UserAPI";
import { IUserAPI } from "./api/users/IUserAPI";
import ProjectsPage from "./pages/ProjectsPage";
import MainWindow from "./pages/MainWindow";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import UserPage from "./pages/UserPage";
import { RegisterPage } from "./pages/RegisterPage";
//import NotificationPage from "./pages/NotificationPage";
import TaskPage from "./pages/TaskPage";
import { FilePage } from "./pages/FilePage";
import { OtpPage } from "./pages/OTPPage";
import { UserRole } from "./enums/UserRole";

const auth_api: IAuthAPI = new AuthAPI();
const user_api: IUserAPI = new UserAPI();

const backgroundImageUrl = new URL("../public/bg2.png", import.meta.url).href;

function App() {
  return (
    <div
      className="h-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        {/*<Route path="/notifications" element={<NotificationPage />} /> */}
        <Route path="/tasks" element={<TaskPage projectId={""} token={""} />} />
        <Route path="/auth" element={<AuthPage authAPI={auth_api} />} />
        <Route path="/register" element={<RegisterPage authAPI={auth_api} />} />
        <Route path="/files" element={<FilePage />} />
        <Route
          path="/mainwindow"
          element={
            <ProtectedRoute requiredRole={Object.values(UserRole).join("|")}>
              <MainWindow />
            </ProtectedRoute>
          }
        />
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
    </div>
  );
}

export default App;
