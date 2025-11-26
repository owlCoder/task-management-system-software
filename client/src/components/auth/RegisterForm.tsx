import React, { useState } from "react";
import { IAuthAPI } from "../../api/auth/IAuthAPI";
import { RegistrationUserDTO } from "../../models/auth/RegistrationUserDTO";
import { UserRole } from "../../enums/UserRole";
import { useAuth } from "../../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

type RegisterFormProps = {
  authAPI: IAuthAPI;
  onSwitchToLogin?: () => void;
};

const logoImageUrl = new URL(
  "../../helpers/pictures/logo.png",
  import.meta.url
).href;

export const RegisterForm: React.FC<RegisterFormProps> = ({
  authAPI,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState<RegistrationUserDTO>({
    username: "",
    email: "",
    password: "",
    role: UserRole.SELLER,
    profileImage: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register(formData);

      if (response.success && response.token) {
        login(response.token);
        navigate("/dashboard");
      } else {
        setError(response.message || "Registration failed.");
      }
    } catch {
      setError("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col items-center gap-4 text-center"
    >

      <img
        src={logoImageUrl}
        alt="A2 Pictures logo"
        className="w-28 h-28 sm:w-32 sm:h-32 object-contain mb-1"
      />
      {error && (
        <div className="w-full rounded-md border border-red-400/70 bg-red-500/20 px-4 py-2 text-left text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="w-full flex flex-col gap-4">
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
        />

        <div className="w-full">
          <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-[85%] mx-auto mt-2 bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
          >
            <option value={UserRole.SELLER}>Seller</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </div>

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
        />

        <div className="w-full">
          <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
            Confirm Password
          </label>
          <div className="w-[95%] mx-auto mt-1 border-b-[3px] border-white/40">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full bg-transparent text-lg text-white placeholder:text-white/70 py-3 outline-none"
            />
          </div>
        </div>

        <Input
          label="Profile Image URL (optional)"
          name="profileImage"
          type="url"
          value={formData.profileImage}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="relative mt-4 w-52 border-2 border-white border-solid text-white uppercase tracking-[0.2em] text-sm font-bold py-3 overflow-hidden bg-transparent cursor-pointer transition-all duration-1000 group disabled:opacity-50"
      >
        <span className="absolute top-0 left-[-40px] h-full w-0 skew-x-[45deg] bg-white/40 transition-all duration-1000 group-hover:w-[160%]" />
        <span className="relative z-10">
          {isLoading ? "Registering..." : "Register"}
        </span>
      </button>

      <p className="mt-2 text-sm text-white/80">
        You already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold underline underline-offset-4 hover:text-blue-100"
        >
          Login
        </button>
      </p>
    </form>
  );
};

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}: any) => (
  <div className="w-full">
    <label className="block w-[95%] mx-auto text-left text-sm font-semibold text-white/80">
      {label}
    </label>
    <div className="w-[95%] mx-auto mt-1 border-b-[3px] border-white/40 transition-colors focus-within:border-white">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={label.toLowerCase().includes("optional") === false}
        className="w-full bg-transparent border-none outline-none text-base font-semibold text-white placeholder:text-white/70 py-2"
      />
    </div>
  </div>
);