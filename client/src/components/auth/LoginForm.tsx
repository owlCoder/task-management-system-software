import React, { useEffect, useState } from "react";
import { IAuthAPI } from "../../api/auth/IAuthAPI";
import { LoginUserDTO } from "../../models/auth/LoginUserDTO";
import { useAuth } from "../../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

type LoginFormProps = {
  authAPI: IAuthAPI;
  onSwitchToRegister?: () => void;
};

const logoImageUrl = new URL(
  "../../helpers/pictures/logo.png",
  import.meta.url
).href;

export const LoginForm: React.FC<LoginFormProps> = ({
  authAPI,
  onSwitchToRegister,
}) => {
  const [formData, setFormData] = useState<LoginUserDTO>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);

      if (response.success && response.token) {
        login(response.token);
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col items-center gap-8 text-center"
    >
      <div className="flex flex-col items-center">
        <img
          src={logoImageUrl}
          alt="A2 Pictures logo"
          className="w-40 h-40 sm:w-48 sm:h-48 object-contain mb-1"
        />
      </div>

      {error && (
        <div className="w-full rounded-md border border-red-400/70 bg-red-500/20 px-4 py-2 text-left text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="w-full flex flex-col gap-6">
        <div className="w-full">
          <label
            htmlFor="username"
            className="block w-[95%] mx-auto text-left text-sm font-semibold tracking-wide text-white/80"
          >
            Username
          </label>
          <div className="w-[95%] mx-auto mt-1 border-b-[3px] border-white/40 transition-colors focus-within:border-white">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={isLoading}
              className="w-full bg-transparent border-none outline-none text-lg font-semibold text-white placeholder:text-white/70 py-3"
            />
          </div>
        </div>

        <div className="w-full">
          <label
            htmlFor="password"
            className="block w-[95%] mx-auto text-left text-sm font-semibold tracking-wide text-white/80"
          >
            Password
          </label>
          <div className="w-[95%] mx-auto mt-1 border-b-[3px] border-white/40 transition-colors focus-within:border-white">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="w-full bg-transparent border-2 border-white outline-none text-lg font-semibold text-white placeholder:text-white/70 py-3"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="relative mt-4 w-52 border-2 border-white text-white uppercase tracking-[0.2em] text-sm font-bold py-3 overflow-hidden bg-transparent cursor-pointer transition-all duration-1000 group disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="absolute top-0 left-[-40px] h-full w-0 skew-x-[45deg] bg-white/40 transition-all duration-1000 group-hover:w-[160%]" />
        <span className="relative z-10">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Logging in...</span>
            </span>
          ) : (
            "Login"
          )}
        </span>
      </button>
      <p className="mt-2 text-sm text-white/80">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold underline underline-offset-4 hover:text-blue-100"
        >
          Register
        </button>
      </p>
    </form>
  );
};