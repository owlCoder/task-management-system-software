import React from "react";
import { UserDTO } from "../../models/users/UserDTO";

const defaultProfileImage = "/user.png";

type UserDetailProps = {
  user: UserDTO;
  onClose: () => void;
};


export const UserDetail: React.FC<UserDetailProps> = ({ user, onClose }) => {
  return (
    <div className="p-6 rounded-xl bg-blue-900/80 backdrop-blur-md w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">User Details</h3>

      <div className="flex justify-center mb-4">
        <img
          src={user.profileImage || defaultProfileImage}
          alt={user.username}
          className="rounded-full object-cover w-20 h-20 border-2 border-white/30"
        />
      </div>

      <div className="flex flex-col gap-3 text-white text-lg">
        <div><span className="font-semibold">Username: </span>{user.username}</div>
        <div><span className="font-semibold">Email: </span>{user.email}</div>
        <div><span className="font-semibold">Role: </span>{user.role_name}</div>
        <div><span className="font-semibold">Weekly Working Hours Sum: </span>{user.weekly_working_hour_sum} </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-lg transition transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
};
