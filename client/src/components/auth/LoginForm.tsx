import React, { useState } from "react";
import { IAuthAPI } from "../../api/auth/IAuthAPI";
import { LoginUserDTO } from "../../models/auth/LoginUserDTO";
import { useAuth } from "../../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

type LoginFormProps = {
  authAPI: IAuthAPI;
  onSwitchToRegister?: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  authAPI,
  onSwitchToRegister,
}) => {
  const [formData, setFormData] = useState<LoginUserDTO>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await authAPI.login(formData);
      login(res.token ?? "");
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Došlo je do greške prilikom prijave."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <h2 className="text-3xl text-white font-bold mb-8 text-center">Login</h2>

      <div className="w-full mb-6">
        <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
          Username
        </label>
        <input
          name="username"
          onChange={handleChange}
          value={formData.username}
          type="text"
          className="w-[95%] mx-auto bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
        />
      </div>

      <div className="w-full mb-6">
        <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
          Password
        </label>
        <input
          name="password"
          onChange={handleChange}
          value={formData.password}
          type="password"
          className="w-[95%] mx-auto bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
        />
      </div>

      {error && <p className="text-red-400 text-center text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-[95%] mx-auto block py-2 rounded-md bg-white/90 text-black font-semibold hover:bg-white"
      >
        {isLoading ? "Loading..." : "Login"}
      </button>

      <p className="mt-4 text-center text-white/70 text-sm">
        Nemate nalog?{" "}
        <span
          className="text-white font-bold cursor-pointer"
          onClick={onSwitchToRegister}
        >
          Register
        </span>
      </p>
    </form>
  );
};
