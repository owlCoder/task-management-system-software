import React, { useEffect, useState } from "react";
import { EditUserFormProps } from "../../types/props/EditUserProps";
import { UserUpdateDTO } from "../../models/users/UserUpdateDTO";
import { UserRole } from "../../enums/UserRole";
import { UserRoleDTO } from "../../models/users/UserRoleDTO";
import toast from "react-hot-toast";

const inputClasses = "w-full px-4 py-3 rounded-xl text-white bg-white/5 backdrop-blur-md border border-white/20 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all shadow-inner";

export const EditUserForm: React.FC<EditUserFormProps> = ({
  userAPI,
  token,
  existingUser,
  onUserUpdated,
  onClose,
}) => {
  const isRestricted = existingUser.role_name === UserRole.ADMIN || existingUser.role_name === UserRole.SYS_ADMIN;
  const [availableRoles, setAvailableRoles] = useState<UserRoleDTO[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [formData, setFormData] = useState({
    username: existingUser.username,
    email: existingUser.email,
    password: "",
    role_name: existingUser.role_name,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(existingUser.image_url || "");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        let impactLevel = 5;
        const roles = await userAPI.getUserRolesForCreation(token, impactLevel);
        setAvailableRoles(roles);

      } catch (err) {
        console.error("Failed to load roles: ", err);
        toast.error("Error loading available roles.");
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [token, userAPI]);


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
    <div className="px-8 py-6 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 w-full max-w-sm mx-auto shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <h3 className="text-xl font-bold mb-5 text-white text-center tracking-tight">Edit Profile</h3>

      <form className="flex flex-col gap-3.5 relative z-10" onSubmit={handleSubmit}>

        <div className="flex flex-col items-center gap-4 mb-2">
          <div className="relative group/avatar">
            <div className="w-16 h-16 rounded-full border-2 border-white/20 shadow-2xl flex items-center justify-center bg-white/5 overflow-hidden transition-all duration-500 group-hover/avatar:border-blue-400/50">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-white/20 uppercase">
                  {existingUser.username.charAt(0)}
                </span>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 rounded-full cursor-pointer transition-opacity duration-300">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
               </svg>
               <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Update Avatar</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
             <label className="text-[10px] ml-4 font-bold text-blue-300/60 uppercase tracking-widest">Username</label>
             <input type="text" name="username" className={inputClasses} value={formData.username} onChange={handleChange} placeholder="Username" />
          </div>

          <div className="space-y-1">
             <label className="text-[10px] ml-4 font-bold text-blue-300/60 uppercase tracking-widest">Email Address</label>
             <input type="email" name="email" className={inputClasses} value={formData.email} onChange={handleChange} placeholder="Email" />
          </div>

          <div className="space-y-1">
             <label className="text-[10px] ml-4 font-bold text-blue-300/60 uppercase tracking-widest">Password</label>
             <input type="password" name="password" className={inputClasses} value={formData.password} onChange={handleChange} placeholder="Password" />
             <p className="text-[9px] ml-4 text-white/20 italic">Leave blank to keep current password</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] ml-4 font-bold text-blue-300/60 uppercase tracking-widest">User Role</label>
            <div className="relative">
              <select 
                name="role_name" 
                className={`${inputClasses} appearance-none ${isRestricted ? 'opacity-50 cursor-not-allowed bg-black/20' : 'cursor-pointer'}`}
                value={formData.role_name}
                onChange={handleChange}
                disabled={isRestricted || loadingRoles}
              >
                {loadingRoles ? (
                  <option value={existingUser.role_name}>
                    {existingUser.role_name.replace(/_/g, " ")} (Loading...)
                  </option>
                ) : (
                  <>
                    {!availableRoles.find(r => r.role_name === existingUser.role_name) && (
                      <option value={existingUser.role_name}>
                        {existingUser.role_name.replace(/_/g, " ")}
                      </option>
                    )}

                    {availableRoles.map((role) => (
                      <option key={role.user_role_id} value={role.role_name} className="bg-slate-900 text-white">
                        {role.role_name.replace(/_/g, " ")}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {!isRestricted && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button 
            type="submit" 
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_25px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
          >
            Save Changes
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-semibold border border-white/5 transition-all"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};