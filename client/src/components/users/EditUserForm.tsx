import React, { useState } from "react";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { UserUpdateDTO } from "../../models/users/UserUpdateDTO";
import { UserRole } from "../../enums/UserRole";


type EditUserFormProps = {
  userAPI: IUserAPI;
  token: string;
  existingUser: UserDTO;
  onUserUpdated: (user: UserDTO) => void;
  onClose: () => void;
};

export const EditUserForm: React.FC<EditUserFormProps> = ({
  userAPI,
  token,
  existingUser,
  onUserUpdated,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    username: existingUser.username,
    email: existingUser.email,
    password: "",
    role_name: existingUser.role_name,
  });

  const [weeklyHours, setWeeklyHours] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const updateData = new UserUpdateDTO(
        formData.username,
        formData.email,
        formData.role_name,
        formData.password || undefined
      );

    const updated = await userAPI.updateUser(token, existingUser.user_id, updateData);

    if(weeklyHours > 0) {
      await userAPI.setWeeklyHours(token, existingUser.user_id, weeklyHours);
    }
      onUserUpdated(updated);
      onClose();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-800/90 to-blue-900/80 backdrop-blur-md w-full max-w-md mx-auto shadow-xl">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">Edit User</h3>

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
          placeholder="Password (leave empty to keep unchanged)"
          className="w-full px-4 py-2 rounded-xl text-white bg-blue-700/60 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <select
          name="role_name"
          value={formData.role_name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl text-white bg-blue-700/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          {Object.values(UserRole).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        <input 
          type="number"
          name="workinghours"
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-xl text-white bg-blue-700/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />


        <div className="flex gap-4 mt-4">
          <button type="submit" className="flex-1 bg-green-500 hover:bg-green-400 text-white py-2 rounded-xl transition transform hover:scale-105">
            Save Changes
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-xl transition transform hover:scale-105">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
