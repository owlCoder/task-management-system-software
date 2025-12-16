import React, { useState } from "react";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { UserCreationDTO } from "../../models/users/UserCreationDTO";
import { UserRole } from "../../enums/UserRole";

type AddUserFormProps = {
  userAPI: IUserAPI;
  token: string;
  onUserAdded: (user: UserDTO) => void;
  onClose: () => void;
};

export const AddUserForm: React.FC<AddUserFormProps> = ({
  userAPI,
  token,
  onUserAdded,
  onClose,
}) => {
  const [formData, setFormData] = useState<UserCreationDTO>({
    username: "",
    email: "",
    password: "",
    role_name: UserRole.ANALYTICS_DEVELOPMENT_MANAGER,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const created = await userAPI.createUser(token, formData);
      onUserAdded(created);
      setFormData({
        username: "",
        email: "",
        password: "",
        role_name: UserRole.ANALYTICS_DEVELOPMENT_MANAGER,
      });
      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-800/90 to-blue-900/80 backdrop-blur-md w-full max-w-md mx-auto shadow-xl">
  <h3 className="text-2xl font-bold mb-6 text-white text-center">Add New User</h3>

  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    <input
      type="text"
      name="username"
      value={formData.username}
      onChange={handleChange}
      placeholder="Username"
      className="w-full px-4 py-2 rounded-xl text-white bg-blue-700/60 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      required
    />

    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Email"
      className="w-full px-4 py-2 rounded-xl text-white bg-blue-700/60 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      required
    />

    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Password"
      className="w-full px-4 py-2 rounded-xl text-white bg-blue-700/60 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      required
    />

    <select
      name="role_name"
      value={formData.role_name}
      onChange={handleChange}
      className="w-full px-4 py-2 rounded-xl text-white bg-blue-700/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    >
      {Object.values(UserRole).map((role) => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>

    <div className="flex gap-4 mt-4">
      <button type="submit" className="flex-1 bg-green-500 hover:bg-green-400 text-white py-2 rounded-xl transition transform hover:scale-105">
        Add
      </button>
      <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-xl transition transform hover:scale-105">
        Cancel
      </button>
    </div>
  </form>
</div>

  );
};
