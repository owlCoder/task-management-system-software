import React, { useState } from "react";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { RegistrationUserDTO } from "../../models/auth/RegistrationUserDTO";
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
  const [formData, setFormData] = useState<RegistrationUserDTO>({
    username: "",
    email: "",
    password: "",
    role: UserRole.ANALYTICS_DEVELOPMENT_MANAGER,
    profileImage: "",
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
      const newUser: UserDTO = {
        id: 0, // server će dodijeliti pravi ID
        username: formData.username,
        email: formData.email,
        role: formData.role,
        profileImage: formData.profileImage,
      };
      const created = await userAPI.createUser(token, newUser);
      onUserAdded(created);
      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: "rgba(30, 60, 120, 0.85)",
        minHeight: "65vh",
        width: "100%",
      }}
    >
      <h3 className="text-xl font-bold mb-4 text-white">Add New User</h3>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-3 py-2 rounded text-white bg-blue-900 placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 rounded text-white bg-blue-900 placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 rounded text-white bg-blue-900 placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded text-white bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={UserRole.SYS_ADMIN}>Sys Admin</option>
          <option value={UserRole.ADMIN}>Admin</option>
          <option value={UserRole.ANALYTICS_DEVELOPMENT_MANAGER}>Analytics development manager</option>
          <option value={UserRole.ANIMATION_WORKER}>Animation worker</option>
          <option value={UserRole.AUDIO_MUSIC_STAGIST}>Audio music stagist</option>
          <option value={UserRole.PROJECT_MANAGER}>Project manager</option>
        </select>

        <input
          type="text"
          name="profileImage"
          value={formData.profileImage}
          onChange={handleChange}
          placeholder="Profile Image URL (optional)"
          className="w-full px-3 py-2 rounded text-white bg-blue-900 placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-lg"
          >
            Add
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
