import React from "react";
import UserList from "../components/users/UserList";
import { UserAPI } from "../api/users/UserAPI";

const userAPI = new UserAPI();

const UserPage: React.FC = () => {
  return (
    <div className="w-full h-full">
      <UserList userAPI={userAPI} />
    </div>
  );
};

export default UserPage;
