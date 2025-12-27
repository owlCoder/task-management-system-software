import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuthHook";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { AddUserForm } from "./AddUserForm";
import { EditUserForm } from "./EditUserForm";
import { UserDetail } from "./UserDetail";
import { UserRole } from "../../enums/UserRole";

type UserListProps = {
  userAPI: IUserAPI;
};

export const UserList: React.FC<UserListProps> = ({ userAPI }) => {
  const { user: authUser, token } = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

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
      const updatedUsers = users.filter((u) => u.user_id !== id);
      setUsers(updatedUsers);
      
      if (selectedRole === "All") {
        setFilteredUsers(updatedUsers);
      } else {
        setFilteredUsers(updatedUsers.filter((u) => u.role_name === selectedRole));
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    if (role === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((u) => u.role_name === role));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
          <header className="flex items-center justify-between mb-6 flex-shrink-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Users</h1>

            <div className="flex gap-3">
              <select
                value={selectedRole}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 rounded-[3em] px-4 py-2 outline-none focus:ring-1 ring-white/30 cursor-pointer hover:bg-white/20 transition-all"
              >
                <option value="All" className="bg-slate-900 text-white">
                  All Roles
                </option>
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white">
                    {r}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="group w-[160px] h-[50px] rounded-[3em] flex items-center justify-center gap-[12px] bg-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-gradient-to-t hover:from-[var(--palette-medium-blue)] hover:to-[var(--palette-deep-blue)] border border-white/15 shadow-lg hover:-translate-y-1 cursor-pointer"
                onClick={() => {
                  setShowAddForm(true);
                  setSelectedUser(null);
                  setIsEditing(false);
                }}
              >
                <svg className="w-5 h-5 text-white/60 group-hover:text-white transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="font-semibold text-white/60 group-hover:text-white transition-colors duration-300 text-base">
                  Add User
                </span>
              </button>
            </div>
          </header>

          <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 flex-1 overflow-y-auto styled-scrollbar">
            {isLoading ? (
              <div className="text-white p-6">Loading users...</div>
            ) : filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredUsers.map((u) => (
                  <div
                    key={u.user_id}
                    className="group flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(u);
                      setShowAddForm(false);
                      setIsEditing(false);
                    }}
                  >
                    <div className="w-20 h-20 rounded-full mb-4 border-2 border-white/20 shadow-md group-hover:border-white/40 transition-all flex items-center justify-center bg-white/10 backdrop-blur-sm">
                      <span className="text-3xl font-bold text-white uppercase select-none">
                        {u.username.charAt(0)}
                      </span>
                    </div>

                    <span className="font-semibold text-white text-lg text-center">
                      {u.username}
                    </span>
                    <span className="text-sm text-white/50 mb-4 text-center">
                      {u.role_name}
                    </span>

                    <div className="flex gap-2 mt-auto">
                      <button
                        className="px-4 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-bold rounded-full border border-white/10 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(u);
                          setIsEditing(true);
                          setShowAddForm(false);
                        }}
                      >
                        Edit
                      </button>

                      {authUser?.id !== u.user_id && (
                        <button
                          className="px-4 py-1.5 bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-bold rounded-full border border-red-500/20 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(u.user_id);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-in fade-in duration-700">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white/90">No Users Found</h2>
                <p className="text-white/40 mt-3 max-w-sm mx-auto text-lg">
                  User with role <span className="text-blue-400 font-bold">"{selectedRole}"</span> does not exist in the system.
                </p>
                <button 
                  onClick={() => handleRoleFilter("All")}
                  className="mt-8 px-8 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all duration-300"
                >
                  Show all users
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {(showAddForm || (selectedUser && isEditing)) && token && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
            {showAddForm && (
              <AddUserForm
                userAPI={userAPI}
                token={token}
                onUserAdded={(newUser) => {
                  setUsers((prev) => {
                    const updatedAllUsers = [...prev, newUser];
                    if (selectedRole === "All") {
                      setFilteredUsers(updatedAllUsers);
                    } else {
                      setFilteredUsers(updatedAllUsers.filter((u) => u.role_name === selectedRole));
                    }
                    return updatedAllUsers;
                  });
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
                  const updateList = (prev: UserDTO[]) => prev.map((u) => u.user_id === updatedUser.user_id ? updatedUser : u);
                  setUsers(updateList);
                  setFilteredUsers(updateList);
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
            <UserDetail
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;