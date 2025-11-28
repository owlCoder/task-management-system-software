import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuthHook";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { AddUserForm } from "./AddUserForm";
import { UserDetail } from "./UserDetail";
import { useNavigate } from "react-router-dom";

type UserListProps = {
  userAPI: IUserAPI;
};

const backgroundImage = "/backgorund.png";
const defaultProfileImage = "/user.png";


export const UserList: React.FC<UserListProps> = ({ userAPI }) => {
  const { user: authUser, token, logout } = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const allUsers = await userAPI.getAllUsers(token);
        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [token, userAPI]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await userAPI.deleteUser(token, id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div
      className="w-full min-h-screen flex justify-center items-start p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(6px)",
        minHeight: "100vh",
      }}
    >
      
      <div
        className="flex flex-row p-6 rounded-xl gap-4"
        style={{
          backgroundColor: "rgba(5, 15, 40, 0.9)",
          width: "100%",
          maxWidth: "900px",
          minHeight: "80vh",
        }}
      >

        <div className="flex flex-col gap-2 w-1/2 items-end">
          {authUser && (
             <div className="text-right mb-2">
              <span className="text-white font-semibold">{authUser.username}</span>
              <br />
            <span className="text-blue-200 text-sm">{authUser.role}</span>
            <button onClick={handleLogout} 
        className="mt-1 px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded text-sm">Log out</button>
       </div>
        )}

          <div
            className="flex items-center gap-2 cursor-pointer text-white mb-2"
            onClick={() => {setShowAddForm(true); setSelectedUser(null); }}
          >
            <span> + Add New User</span>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "70vh" }}>
            {isLoading ? (
              <p className="text-white">Loading users...</p>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between px-3 rounded-lg"
                  style={{
                    backgroundColor: "rgba(30, 60, 120, 0.85)",
                    height: "60px",
                    width: "50vw",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    setSelectedUser(u);
                    setShowAddForm(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 rounded-full overflow-hidden"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <img
                        src={u.profileImage || defaultProfileImage}
                        alt={u.username}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-0.5">
                      <span className="text-white font-semibold text-sm">{u.username}</span>
                      <span className="text-blue-200 text-xs">{u.role}</span>
                    </div>
                  </div>

                  <div className="cursor-pointer text-red-500" onClick={() => handleDelete(u.id)}>
                    Delete
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {showAddForm && token && (
          <div
            className="flex flex-col w-1/2 p-4 rounded-lg bg-blue-900"
            style={{ marginTop: "80px", width: "60%",  minWidth: "300px", maxWidth: "400px", }} 
          >
            <AddUserForm
              userAPI={userAPI}
              token={token}
              onUserAdded={(newUser) => setUsers((prev) => [...prev, newUser])}
              onClose={() => setShowAddForm(false)}
            />
          </div>
        )}

        { selectedUser && (
           <div
            className="flex flex-col w-1/2 p-4 rounded-lg"
            style={{
              marginTop: "80px",
              width: "60%",
              minWidth: "300px",
              maxWidth: "400px",
            }}
          >
            <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
