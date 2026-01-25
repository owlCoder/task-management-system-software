import React, { useState } from "react";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { UserUpdateDTO } from "../../models/users/UserUpdateDTO";
import { UserRole } from "../../enums/UserRole";
import toast from "react-hot-toast";

type EditUserFormProps = {
  userAPI: IUserAPI;
  token: string;
  existingUser: UserDTO;
  onUserUpdated: (user: UserDTO) => void;
  onClose: () => void;
};

const inputClasses = "w-full px-4 py-3 rounded-xl text-white bg-white/5 backdrop-blur-md border border-white/20 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all shadow-inner";

export const EditUserForm: React.FC<EditUserFormProps> = ({
  userAPI,
  token,
  existingUser,
  onUserUpdated,
  onClose,
}) => {
  const isRestricted = existingUser.role_name === UserRole.ADMIN || existingUser.role_name === UserRole.SYS_ADMIN;

  const [formData, setFormData] = useState({
    username: existingUser.username,
    email: existingUser.email,
    password: "",
    role_name: existingUser.role_name,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(existingUser.image_url || "");

 // const [weeklyHours, setWeeklyHours] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const updateData = new UserUpdateDTO(
        formData.username,
        formData.email,
        formData.role_name,
        formData.password || undefined,
        imageFile || undefined
      );

    const updated = await userAPI.updateUser(token, existingUser.user_id, updateData);
    toast.success("User updated successfully!");

    onUserUpdated(updated);
    onClose();
  
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Update failed!");
    }
    
  };

  return (
  <div className="p-8 rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/20 w-full max-w-md mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
    <h3 className="text-2xl font-bold mb-6 text-white text-center tracking-tight">Edit User</h3>

    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-3 mb-2">
        <div className="w-24 h-24 rounded-full border-2 border-white/40 shadow-xl flex items-center justify-center bg-white/10 overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-white/80 uppercase">
              {existingUser.username.charAt(0)}
            </span>
          )}
        </div>
        <label className="cursor-pointer px-4 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition">
          <span className="text-white text-xs font-medium">Change Photo</span>
          <input type="file" className="hidden" onChange={handleImageChange} />
        </label>
      </div>
      
      <div className="space-y-4">
        <input type="text" name="username" className={inputClasses} value={formData.username} onChange={handleChange} placeholder="Username" />
        <input type="email" name="email" className={inputClasses} value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" className={inputClasses} value={formData.password} onChange={handleChange} placeholder="New Password (optional)" />
        
        <div className="flex flex-col gap-1">
          <select 
            name="role_name" 
            className={inputClasses}
            value={formData.role_name}
            onChange={handleChange}
            disabled={isRestricted}
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role} className="bg-[#1a2b4b] text-white">{role}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          type="submit" 
          className="flex-1 h-[50px] rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          Save Changes
        </button>
        <button 
          type="button" 
          onClick={onClose} 
          className="flex-1 h-[50px] rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 font-semibold border border-white/10 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
);
};