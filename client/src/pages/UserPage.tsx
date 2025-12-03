import React from "react";
import { UserList } from "../components/users/UserList";
import { UserAPI } from "../api/users/UserAPI";
import Sidebar from "../components/dashboard/navbar/Sidebar";

const userAPI = new UserAPI();

const UserPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <UserList userAPI={userAPI} />
      </div>
    </div>
  );
};

export default UserPage;
