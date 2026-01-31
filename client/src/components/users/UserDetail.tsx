import React from "react";
import { UserDetailProps } from "../../types/props/UserDetailProps";

export const UserDetail: React.FC<UserDetailProps> = ({ user, onClose }) => {
  const hasImage = user.image_url && user.image_url.trim() !== "";

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 w-full max-w-md mx-auto shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-500"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white/90">User Profile</h3>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative p-1 rounded-full bg-gradient-to-tr from-blue-500/50 to-purple-500/50 mb-4">
            <div className="w-24 h-24 rounded-full border-2 border-[#0f172a] shadow-2xl flex items-center justify-center bg-slate-800 overflow-hidden">
            {hasImage ? (
                <img src={user.image_url} alt={user.username} className="w-full h-full object-cover" />
            ) : (
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 uppercase">
                {user.username.charAt(0)}
                </span>
            )}
            </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
        <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-widest">
            {user.role_name.replace(/_/g, " ")}
        </span>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 transition-all hover:bg-white/[0.08] hover:border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold block mb-1">Email Address</span>
            <span className="text-base font-medium text-white/90 break-all">{user.email}</span>
        </div>
        
      </div>

      <button
        onClick={onClose}
        className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 text-white font-bold transition-all active:scale-[0.98] shadow-[0_10px_20px_rgba(59,130,246,0.3)]"
      >
        Close
      </button>
    </div>
  );
};