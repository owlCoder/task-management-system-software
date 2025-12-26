import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logoImageUrl from "../../../../public/logo.png";
import { useAuth } from "../../../hooks/useAuthHook";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <aside
      className={`w-54 h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-[4px_0_25px_rgba(0,0,0,0.25)] p-4 flex flex-col justify-between rounded-tr-xl rounded-br-xl overflow-hidden`}
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
      <nav className="flex-1 flex flex-col items-stretch gap-4 mt-2">
        <Link
          to="/projects"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Projects
        </Link>

        <Link
          to="/tasks"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Tasks
        </Link>

        <Link
          to="/analytics"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Analytics
        </Link>

        <Link
          to="/files"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Files
        </Link>

        <Link
          to="/notifications"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Notifications
        </Link>

        {user?.role === "Admin" && (
          <Link
          to="/users"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Users
        </Link>
        )}

        
      </nav>

      {/* Bottom: User info */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3 relative">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white/90">
          {user?.username.charAt(0).toUpperCase()}
        </div>

        <div className="text-sm flex-1">
          <div className="font-semibold text-white">{user?.username}</div>
          <div className="text-xs text-white/70">{user?.role}</div>
        </div>

        {/* Logout icon */}
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition"
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
