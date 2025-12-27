import React, { useState, useEffect } from "react"; // Dodali smo useEffect
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { UserCreationDTO } from "../../models/users/UserCreationDTO";
import { UserRoleDTO } from "../../models/users/UserRoleDTO";

const inputClasses = "w-full px-4 py-3 rounded-xl text-white bg-black/20 backdrop-blur-md border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-black/30 transition-all shadow-inner";

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

  const [availableRoles, setAvailableRoles] = useState<UserRoleDTO[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [formData, setFormData] = useState<UserCreationDTO>({
    username: "",
    email: "",
    password: "",
    role_name: "", 
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await userAPI.getUserRolesForCreation(token);
        setAvailableRoles(roles);
        if (roles.length > 0) {
          setFormData(prev => ({ ...prev, role_name: roles[0].role_name }));
        }
      } catch (err) {
        console.error("Failed to load roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [token, userAPI]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const created = await userAPI.createUser(token, formData);
      onUserAdded(created);
      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
      alert("Error adding user. Check if username/email already exists.");
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 w-full max-w-md mx-auto shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">Add New User</h3>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputClasses} required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClasses} required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={inputClasses} required />

        <select 
          name="role_name" 
          value={formData.role_name} 
          onChange={handleChange} 
          className={inputClasses}
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

        <div className="flex gap-3 mt-6">
          <button 
            type="submit" 
            disabled={loadingRoles}
            className="flex-1 h-[50px] rounded-full bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] text-white font-bold shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
          >
            Add User
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