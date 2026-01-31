import React, { useState, useEffect } from "react";
import { AddUserFormProps } from "../../types/props/AddUserProps";
import { UserCreationDTO } from "../../models/users/UserCreationDTO";
import { UserRoleDTO } from "../../models/users/UserRoleDTO";
import toast from "react-hot-toast";

const inputClasses = "w-full px-4 py-3 rounded-xl text-white bg-white/10 backdrop-blur-md border border-white/20 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/20 transition-all shadow-inner";

export const AddUserForm: React.FC<AddUserFormProps> = ({
  userAPI,
  token,
  onUserAdded,
  onClose,
}) => {
  const [availableRoles, setAvailableRoles] = useState<UserRoleDTO[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  /*const [formData, setFormData] = useState<Omit<UserCreationDTO, 'image_file'>>({
    username: "",
    email: "",
    password: "",
    role_name: "", 
  });*/

    const [formData, setFormData] = useState<UserCreationDTO>({
    username: "",
    email: "",
    password: "",
    role_name: "", 
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        let impactLevel = 5;
        const roles = await userAPI.getUserRolesForCreation(token, impactLevel);
        setAvailableRoles(roles);
        if (roles.length > 0) {
          setFormData(prev => ({ ...prev, role_name: roles[0].role_name }));
        } 
      } catch (err) {
        console.error("Failed to load roles:", err);
        toast.error("Error loading available roles.");
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [token, userAPI]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const createData: UserCreationDTO = {
        ...formData,
        image_file: imageFile || undefined,
      };

      const created = await userAPI.createUser(token, createData);
      toast.success("User created successfully!");
      onUserAdded(created);
      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
      toast.error("Error adding user.");
    }
  };

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 w-full max-w-md mx-auto shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <h3 className="text-2xl font-bold mb-8 text-white text-center tracking-tight">Add New User</h3>

      <form className="flex flex-col gap-5 relative z-10" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-4 mb-2">
          <div className="relative group/avatar">
            <div className="w-24 h-24 rounded-full border-2 border-white/20 shadow-2xl flex items-center justify-center bg-white/5 overflow-hidden transition-transform duration-500 group-hover/avatar:scale-105">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-white/20 uppercase select-none">
                  {formData.username ? formData.username.charAt(0) : "?"}
                </span>
              )}
            </div>
            
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 rounded-full cursor-pointer transition-opacity duration-300">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {imagePreview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-xs font-bold text-red-400/80 hover:text-red-400 transition-colors uppercase tracking-widest"
            >
              Remove Photo
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputClasses} required />
          </div>
          
          <div className="relative">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClasses} required />
          </div>
          
          <div className="relative">
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={inputClasses} required />
          </div>

          <div className="relative">
            <select 
              name="role_name" 
              value={formData.role_name} 
              onChange={handleChange} 
              className={`${inputClasses} appearance-none cursor-pointer`}
              disabled={loadingRoles}
            >
              {loadingRoles ? (
                <option>Loading roles...</option>
              ) : (
                availableRoles.map((role) => (
                  <option key={role.user_role_id} value={role.role_name} className="bg-slate-900">
                    {role.role_name.replace(/_/g, " ")} 
                  </option>
                ))
              )}
            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button 
            type="submit" 
            disabled={loadingRoles}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_25px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
          >
            Add User
          </button>
          
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-semibold border border-white/5 transition-all duration-300"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};