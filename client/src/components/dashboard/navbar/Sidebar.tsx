import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImageUrl from "../../../../public/logo.png";

interface SidebarProps {
  username?: string;
  role?: string;
  profileImage?: string;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  username = "Username",
  role = "Role",
  profileImage,
  className = "",
}) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <aside
      className={`w-48 min-h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-[4px_0_25px_rgba(0,0,0,0.25)] p-4 flex flex-col justify-between rounded-tr-xl rounded-br-xl overflow-hidden ${className}`}
    >
      {/* Top: Logo */}
      <div className="pt-4 pb-4 flex items-center justify-center">
        <div className="p-3 rounded-md flex items-center justify-center">
          {
            <img
              src={logoImageUrl}
              alt="Logo"
              className="w-30 h-30 object-contain"
              onError={() => setLogoError(true)}
            />
          }
        </div>
      </div>

      {/* Middle: Buttons */}
      <nav className="flex-1 flex flex-col items-stretch gap-4 mt-4">
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
      </nav>

      {/* Bottom: User info */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
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

        <div className="text-sm">
          <div className="font-semibold text-white">{username}</div>
          <div className="text-xs text-white/70">{role}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
