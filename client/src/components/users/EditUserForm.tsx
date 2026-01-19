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

const inputClasses = "w-full px-4 py-3 rounded-xl text-white bg-black/20 backdrop-blur-md border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-black/30 transition-all shadow-inner";

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
    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 w-full max-w-md mx-auto shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">Edit User</h3>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full border-2 border-white/20 shadow-md flex items-center justify-center bg-white/10 backdrop-blur-sm overflow-hidden">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white uppercase select-none">
                {existingUser.username.charAt(0)}
              </span>
            )}
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition">
            <span className="text-white/90 text-sm">
              {imageFile ? imageFile.name : "Choose Profile Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputClasses} required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClasses} required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="New Password (optional)" className={inputClasses} />
        
        <div className="flex flex-col gap-1">
          {isRestricted && <label className="text-[10px] text-blue-400 ml-2 uppercase tracking-wider">Role changes disabled for Admin</label>}
          <select 
            name="role_name" 
            value={formData.role_name} 
            onChange={handleChange} 
            disabled={isRestricted}
            className={`${inputClasses} ${isRestricted ? "opacity-50 cursor-not-allowed border-blue-500/30" : ""}`}
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role} className="bg-slate-900">{role}</option>
            ))}
          </select>
        </div>

        {/*
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40 ml-2">Weekly Working Hours</label>
          <input type="number" name="workinghours" value={weeklyHours} onChange={(e) => setWeeklyHours(Number(e.target.value))} className={inputClasses} />
        </div>  */}
         

        <div className="flex gap-3 mt-6">
          <button 
            type="submit" 
            className="flex-1 h-[50px] rounded-full bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] text-white font-bold shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Save Changes
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 h-[50px] rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};