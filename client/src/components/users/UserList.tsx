import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuthHook";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { AddUserForm } from "./AddUserForm";
import { EditUserForm } from "./EditUserForm";
import { UserDetail } from "./UserDetail";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../enums/UserRole";

type UserListProps = {
  userAPI: IUserAPI;
};

const defaultProfileImage = "/user.png";
const defaultAdminImage = "/admin.png";

export const UserList: React.FC<UserListProps> = ({ userAPI }) => {
  const { user: authUser, token, logout } = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const allUsers = await userAPI.getAllUsers(token);
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        setRoles(Object.values(UserRole));
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

    if (authUser?.id === id) return;
    try {
      await userAPI.logicalyDeleteUserById(token, id);
      setUsers(prev => prev.filter(u => u.user_id !== id));
      setFilteredUsers(prev => prev.filter(u => u.user_id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    if (role === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(u => u.role_name === role));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-xl shadow-md">
          <h1 className="text-2xl font-bold text-white">Users</h1>
          {authUser && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-300">
                <img
                  src={defaultAdminImage}
                  alt={authUser.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-semibold text-white">{authUser.username}</span>
                <span className="text-xs text-white/70">{authUser.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-400 transition"
              >
                Log out
              </button>
            </div>
          )}
        </header>

        <div className="flex justify-between px-6 py-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition"
            onClick={() => {
              setShowAddForm(true);
              setSelectedUser(null);
              setIsEditing(false);
            }}
          >
            + Add New User
          </button>

          <select
            value={selectedRole}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            <option value="All">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {isLoading ? (
            <p className="text-white/70 col-span-full">Loading users...</p>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.user_id}
                className="w-64 flex flex-col items-center p-6 rounded-2xl border border-blue/20 
                           bg-white/10 backdrop-blur-sm shadow-lg transform transition-all duration-200 
                           hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                onClick={() => {
                  setSelectedUser(u);
                  setShowAddForm(false);
                  setIsEditing(false);
                }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/20 shadow-sm">
                  <img
                    src={u.profileImage || defaultProfileImage}
                    alt={u.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="font-semibold text-white text-lg text-center">{u.username}</span>
                <span className="text-sm text-white/70 mb-4 text-center">{u.role_name}</span>

                <div className="flex gap-3 mt-auto">
                  <span
                    className="px-3 py-1 bg-yellow-400 text-black font-semibold text-sm rounded-md 
                               hover:bg-yellow-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(u);
                      setIsEditing(true);
                      setShowAddForm(false);
                    }}
                  >
                    Edit
                  </span>

                  {authUser?.id !== u.user_id && (
                    <span
                      className="px-3 py-1 bg-red-600 text-white font-semibold text-sm rounded-md 
                                 hover:bg-red-500 hover:shadow-md transition-all cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(u.user_id);
                      }}
                    >
                      Delete
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </main>

        {(showAddForm || (selectedUser && isEditing)) && token && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="w-full max-w-md transform transition-transform duration-300 scale-100">
              {showAddForm && (
                <AddUserForm
                  userAPI={userAPI}
                  token={token}
                  onUserAdded={(newUser) => {
                    setUsers((prev) => [...prev, newUser]);
                    handleRoleFilter(selectedRole); 
                  }}
                  onClose={() => setShowAddForm(false)}
                />
              )}
              {selectedUser && isEditing && (
                <EditUserForm
                  userAPI={userAPI}
                  token={token}
                  existingUser={selectedUser}
                  onUserUpdated={(updatedUser) => {
                    setUsers((prev) =>
                      prev.map((u) => (u.user_id === updatedUser.user_id ? updatedUser : u))
                    );

                     setFilteredUsers((prev) =>
        prev.map((u) => (u.user_id === updatedUser.user_id ? updatedUser : u))
      );
                    setSelectedUser(null);
                    setIsEditing(false);
                  }}
                  onClose={() => {
                    setSelectedUser(null);
                    setIsEditing(false);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {selectedUser && !isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="w-full max-w-md transform transition-transform duration-300 scale-100">
              <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
