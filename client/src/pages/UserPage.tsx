import React from "react";
import { UserList } from "../components/users/UserList";
import { UserAPI } from "../api/users/UserAPI";
import Sidebar from "../components/dashboard/sidebar/Sidebar";

const userAPI = new UserAPI();

const UserPage: React.FC = () => {
  return (
    <div className="flex h-screen min-h-screen">
      <Sidebar />

      <div className="flex-1 h-full overflow-auto ">
        <UserList userAPI={userAPI} />
      </div>
    </div>
  );
};

export default UserPage;
