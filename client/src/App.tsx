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
import NotificationPage from "./pages/NotificationPage";
import TaskPage from "./pages/TaskPage";
import { FilePage } from "./pages/FilePage";

const auth_api: IAuthAPI = new AuthAPI();
const user_api: IUserAPI = new UserAPI();

const backgroundImageUrl = new URL("../public/bg.jpg", import.meta.url).href;

function App() {
  return (
    <div
      className="h-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/tasks" element={<TaskPage projectId={""} token={""} />} />
        <Route path="/auth" element={<AuthPage authAPI={auth_api} />} />
        <Route path="/register" element={<RegisterPage authAPI={auth_api} />} />
        <Route path="/files" element={<FilePage/>} />
        <Route path="/" element={<MainWindow />} />
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
