import React from "react";
import { UserDTO } from "../../models/users/UserDTO";

const defaultProfileImage = "/user.png";

type UserDetailProps = {
    user: UserDTO;
    onClose: () => void;
};

export const UserDetail: React.FC<UserDetailProps> = ({user, onClose}) => {
    return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: "rgba(30, 60, 120, 0.85)",
        minHeight: "60vh",
        width: "100%",
      }}
    >
      <h3 className="text-xl font-bold mb-4 text-white">User {user.username}</h3>

      <div className="flex justify-center mb-4">
        <img
          src={user.profileImage || defaultProfileImage}
          alt={user.username}
          className="rounded-full object-cover"
          style={{ width: "80px", height: "80px" }}
        />
      </div>

      <div className="flex flex-col gap-3 text-white">
        <div>
          <span className="font-semibold">Username: </span>
          <span>{user.username}</span>
        </div>
        <div>
          <span className="font-semibold">Email: </span>
          <span>{user.email}</span>
        </div>
        <div>
          <span className="font-semibold">Role: </span>
          <span>{user.role}</span>
        </div>
        <div>
          <span className="font-semibold">Weekly Hours: </span>
          <span>{user.weekly_working_hour_sum ?? 0}</span>
        </div>
        
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}