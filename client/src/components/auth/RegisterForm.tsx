import React, { useState } from "react";
import { IAuthAPI } from "../../api/auth/IAuthAPI";
import { RegistrationUserDTO } from "../../models/auth/RegistrationUserDTO";
import { useAuth } from "../../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../enums/UserRole";

type RegisterFormProps = {
  authAPI: IAuthAPI;
  onSwitchToLogin?: () => void;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  authAPI,
  onSwitchToLogin,
}) => {

  // 🔥 OVO JE ISPRAVAN STATE
  const [formData, setFormData] = useState<any>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: UserRole.ANIMATION_WORKER,
    profileImage: "", // DTO ga zahteva
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

    // 🔥 VALIDACIJA ZA POTVRDU LOZINKE
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
        profileImage: "", // šaljemo jer je required
      };

      const res = await authAPI.register(sendData);
      login(res.token ?? "");
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Došlo je do greške prilikom registracije."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <h2 className="text-3xl text-white font-bold mb-8 text-center">
        Register
      </h2>

      {/* USERNAME */}
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

      {/* EMAIL */}
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

      {/* PASSWORD */}
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

      {/* CONFIRM PASSWORD — ISPRAVLJENO */}
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

      {/* ROLE */}
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
        Već imate nalog?{" "}
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
