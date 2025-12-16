import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImageUrl from "../../../../public/logo.png";
import type { SidebarProps } from "../../../models/dashboard/navbar/SidebarPropsDTO";

const Sidebar: React.FC<SidebarProps> = ({
  username = "Username",
  role = "Role",
  profileImage,
  className = "",
}) => {
  const [logoError, setLogoError] = useState(false); // KOJA JE POENTA logoError - ukoloni ga visak je
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside
      className={`w-54 min-h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-[4px_0_25px_rgba(0,0,0,0.25)] p-4 flex flex-col justify-between rounded-tr-xl rounded-br-xl overflow-hidden ${className}`}
    >
      {/* Top: Logo */}
      <div className="pt-4 pb-4 flex items-center justify-center">
        <div className="p-2 rounded-md flex items-center justify-center">
          {
            <img
              src={logoImageUrl}
              alt="Logo"
              className="w-34 h-34 object-contain"
              onError={() => setLogoError(true)}
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

        <Link
          to="/users"
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 transition text-center"
        >
          Users
        </Link>
      </nav>

      {/* Bottom: User info */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3 relative">
        {profileImage ? (
          <img
            src={profileImage}
            alt={username}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white/90">
            {username.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="text-sm flex-1">
          <div className="font-semibold text-white">{username}</div>
          <div className="text-xs text-white/70">{role}</div>
        </div>

        {/* Settings (gear) icon to toggle logout */}
        <button
          type="button"
          aria-label="User settings"
          className="p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition"
          onClick={() => setShowUserMenu((v) => !v)}
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
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.4 4.6 1.65 1.65 0 0 0 9.91 3.6H10A2 2 0 1 1 14 3.6h.09a1.65 1.65 0 0 0 1.51 1 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 bottom-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-md shadow-lg p-2 flex flex-col min-w-[140px]">
            <Link
              to="/auth"
              className="w-full px-3 py-2 rounded text-sm text-white/90 hover:bg-white/20 hover:text-white transition text-center"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
