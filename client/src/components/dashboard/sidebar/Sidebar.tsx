import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logoImageUrl from "../../../../public/logo.png";
import { useAuth } from "../../../hooks/useAuthHook";
import { UserRole } from "../../../enums/UserRole";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isAdmin = user?.role === "Admin";
  const isProjectManager = user?.role === UserRole.PROJECT_MANAGER;

  return (
    <aside
      className={`w-56 h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-[4px_0_25px_rgba(0,0,0,0.25)] p-4 flex flex-col justify-between rounded-tr-xl rounded-br-xl overflow-hidden`}
    >
      {/* Top: Logo */}
      <div className="pt-4 pb-4 flex items-center justify-center">
        <div className="p-2 rounded-md flex items-center justify-center">
          {
            <img
              src={logoImageUrl}
              alt="Logo"
              className="w-34 h-34 object-contain"
            />
          }
        </div>
      </div>

      {/* Middle: Buttons */}
      <nav className="flex-1 flex flex-col items-stretch gap-4 mt-2 overflow-y-auto styled-scrollbar pr-2">
        {!isAdmin && (
          <Link
          to="/projects"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Projects
        </Link>
        )}

        {!isAdmin && !isProjectManager &&(
          <Link
          to="/analytics"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Analytics
        </Link>
        )}

        {!isAdmin &&  !isProjectManager &&(
          <Link
          to="/files"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Files
        </Link>
        )}

        <Link
          to="/notifications"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Notifications
        </Link>
        
        {user?.role === "Project Manager" && (
        <Link
          to="/reviews"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Reviews
        </Link>
        )}

        {isAdmin && (
          <Link
          to="/users"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Users
        </Link>
        )}

        <Link
          to="/statuses"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Service Statuses 
        </Link>
        
      </nav>

      {/* Bottom: User info */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3 relative">
       <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-white/10 shrink-0">
        {user?.image_url ? (
          <img
            src={user.image_url}
            alt={user.username}
            className="w-full h-full object-cover"
            style={{minWidth: '100%', minHeight: '100%'}}
          />
        ) : (
          <span className="text-lg font-bold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
        )}
      </div>

        <div className="text-sm flex-1">
          <div className="font-semibold text-white">{user?.username}</div>
          <div className="text-xs text-white/70">{user?.role}</div>
        </div>

        {/* Logout icon */}
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
