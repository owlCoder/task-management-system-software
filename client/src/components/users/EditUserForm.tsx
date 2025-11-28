import React, { useState } from "react";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { UserCreationDTO } from "../../models/users/UserCreationDTO"; // ako ti backend koristi UserCreationDTO
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
  const [formData, setFormData] = useState<UserCreationDTO>({
    username: existingUser.username,
    email: existingUser.email,
    password: "", 
    role_name: existingUser.role as string, 
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const updateData: Partial<UserCreationDTO> = {
        username: formData.username,
        email: formData.email,
        role_name: formData.role_name,
      };
      if (formData.password) updateData.password = formData.password;

      const updated = await userAPI.updateUser(token, existingUser.id, updateData);
      onUserUpdated(updated);
      onClose();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return (
    <div
      className="p-4 rounded-lg bg-blue-900"
      style={{ width: "100%" }}
    >
      <h3 className="text-xl font-bold mb-4 text-white">Edit User</h3>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-3 py-2 rounded text-white bg-blue-800 placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 rounded text-white bg-blue-800 placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password (leave empty to keep unchanged)"
          className="w-full px-3 py-2 rounded text-white bg-blue-800 placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="role_name"
          value={formData.role_name}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded text-white bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={UserRole.SYS_ADMIN}>Sys Admin</option>
          <option value={UserRole.ADMIN}>Admin</option>
          <option value={UserRole.ANALYTICS_DEVELOPMENT_MANAGER}>Analytics & Development Manager</option>
          <option value={UserRole.ANIMATION_WORKER}>Animation Worker</option>
          <option value={UserRole.AUDIO_MUSIC_STAGIST}>Audio Music Stagist</option>
          <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
        </select>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
