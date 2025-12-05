import React, { useState } from "react";
import { IAuthAPI } from "../../api/auth/IAuthAPI";
import { RegistrationUserDTO } from "../../models/auth/RegistrationUserDTO";
import { useAuth } from "../../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../enums/UserRole";
import logoImage from "../../../public/logo.png";

type RegisterFormProps = {
  authAPI: IAuthAPI;
  onSwitchToLogin?: () => void;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  authAPI,
  onSwitchToLogin,
}) => {

  
  const [formData, setFormData] = useState<any>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: UserRole.ANIMATION_WORKER,
    profileImage: "", 
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "role" ? (value as UserRole) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const sendData: RegistrationUserDTO = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profileImage: "", 
      };

      const res = await authAPI.register(sendData);
      login(res.token ?? "");
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "There was an error during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <img
        src={logoImage}
        alt="Logo"
        className="w-50 mx-auto mb-8 select-none"
      />

      
      <div className="w-full mb-6">
        <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
          Username
        </label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          type="text"
          className="w-[95%] mx-auto bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
        />
      </div>

      
      <div className="w-full mb-6">
        <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
          Email
        </label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          className="w-[95%] mx-auto bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
        />
      </div>

     
      <div className="w-full mb-6">
        <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
          Password
        </label>
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          className="w-[95%] mx-auto bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
        />
      </div>

      
      <div className="w-full mb-6">
        <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          type="password"
          className="w-[95%] mx-auto bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
        />
      </div>

     
      <div className="w-full mb-6">
        <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-[95%] mx-auto mt-2 bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
        >
          {Object.values(UserRole).map((role) => (
            <option key={role} value={role} className="text-black">
              {role}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-400 text-center text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-[95%] mx-auto block py-2 rounded-md bg-white/90 text-black font-semibold hover:bg-white"
      >
        {isLoading ? "Loading..." : "Register"}
      </button>

      <p className="mt-4 text-center text-white/70 text-sm">
        Already have an account?{" "}
        <span
          className="text-white font-bold cursor-pointer"
          onClick={onSwitchToLogin}
        >
          Login
        </span>
      </p>
    </form>
  );
};
