import React from "react";
import { UserDTO } from "../../models/users/UserDTO";

type UserDetailProps = {
  user: UserDTO;
  onClose: () => void;
};

export const UserDetail: React.FC<UserDetailProps> = ({ user, onClose }) => {
  const hasImage = user.image_url && user.image_url.trim() !== "";

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/15 backdrop-blur-2xl border border-white/20 w-full max-w-md mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
      
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
      
      <h3 className="text-2xl font-bold mb-8 text-white text-center tracking-tight">User Details</h3>

      <div className="flex justify-center mb-8">
        <div className="w-28 h-28 rounded-full border-2 border-white/40 shadow-xl flex items-center justify-center bg-white/10 relative overflow-hidden">
          {hasImage ? (
            <img 
              src={user.image_url} 
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl font-extrabold text-white/90 uppercase select-none">
              {user.username.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        {[
          { label: "Username", value: user.username },
          { label: "Email", value: user.email },
          { label: "Role", value: user.role_name.replace(/_/g, " ") },
          { label: "Weekly Hours", value: `${user.weekly_working_hour_sum || 0} h` }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 transition-all hover:bg-white/10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-300/80 font-bold block mb-1">
              {item.label}
            </span>
            <span className="text-lg font-medium text-white break-all">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-all active:scale-95 shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};