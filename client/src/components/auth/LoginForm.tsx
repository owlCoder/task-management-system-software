import React, { useState, useRef, useEffect } from "react";
import { LoginUserDTO } from "../../models/auth/LoginUserDTO";
import { useAuth } from "../../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../public/logo.png";
import { LoginFormProps } from "../../types/LoginFormProps";
import type { AuthResponseType } from "../../types/AuthResponseType";
import type { WindowWithGoogle } from "../../types/GoogleType";

type LoginResponseType = AuthResponseType & {
  otp_required?: boolean;
  session?: string;
};

type GoogleResponse = {
  credential: string;
};

type SysErr = {
  code?: string;
  message?: string;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  authAPI,
}) => {
  const [formData, setFormData] = useState<LoginUserDTO>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const googleInitializedRef = useRef(false);
  const googleBtnDivRef = useRef<HTMLDivElement | null>(null);

  const [usernameErr, setUsernameErr] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<string>("");

  function validateUsername(v: string): string {
    const s = v.trim();
    if (s.length === 0) return "Username is required.";
    if (s.length < 5) return "Username must be at least 5 characters.";
    return "";
  }

  function validatePassword(v: string): string {
    if (v.length === 0) return "Password is required.";
    if (v.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((p) => ({ ...p, [name]: value }));

    if (name === "username") setUsernameErr(validateUsername(value));
    if (name === "password") setPasswordErr(validatePassword(value));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await authAPI.login(formData);
      const r = res as LoginResponseType;

      if(!r.success) {
        setError(r.message || "Login failed");
        return;
      }

      if(r.otp_required) {
        navigate("/otp", { state: { session: r.session } });
        return;
      }

      if(r.token) {
        login(r.token);
        navigate("/mainwindow");
        return;
      }

      setError("No token/session received.");
    }  catch (err) {
      console.error("Failed to login:", err);
      const e = err as { response?: { status?: number; data?: SysErr } };
      if (e.response?.status === 403 && e.response.data?.code === "ROLE_NOT_ALLOWED") {
        setError("SysAdmin cannot login through TMSS endpoint");
        return;
      }
      setError(e.response?.data?.message || "There was an error during login. Please try again.");
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let resizeHandler: (() => void) | null = null;

    const t = setInterval(() => {
      const googleWin = (window as WindowWithGoogle).google;

      if (googleInitializedRef.current) {
        clearInterval(t);
        return;
      }

      const id = googleWin?.accounts?.id;
      if (!id) return;

      id.initialize({
        client_id: clientId,
        ux_mode: "popup",
        auto_select: false,
        cancel_on_tap_outside: true,
        callback: async (response: GoogleResponse) => {
          setError("");
          try {
            const data = await authAPI.googleLogin({ idToken: response.credential });

            if (data.success) {
              if (data.token) {
                login(data.token);
                navigate("/mainwindow");
              } else {
                console.log("Logged in via Google", data);
              }
            } else {
              setError(data.message || "Google login failed");
            }
          } catch (err) {
            console.error("Google login failed:", err);
            setError("Network error during Google login");
          }
        },
      });

      const renderGoogleButton = () => {
        const el = googleBtnDivRef.current;
        const id2 = googleWin?.accounts?.id;
        if (!el || !id2) return;

        const parentWidth = el.parentElement?.clientWidth ?? 390;
        el.innerHTML = "";
        id2.renderButton(el, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: parentWidth,
          locale: "en",
        });
      };

      renderGoogleButton();

      resizeHandler = renderGoogleButton;
      window.addEventListener("resize", resizeHandler);

      googleInitializedRef.current = true;
      clearInterval(t);
    }, 100);

    return () => {
      clearInterval(t);
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
    };
  }, [authAPI, login, navigate]);


  const canSubmit =
  !isLoading &&
  validateUsername(formData.username) === "" &&
  validatePassword(formData.password) === "";

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
          onChange={handleChange}
          value={formData.username}
          type="text"
          className="w-[95%] mx-auto bg-transparent border-b-[3px] border-white/40 text-white py-2 outline-none"
        />
        {usernameErr && <p className="w-[95%] mx-auto text-red-400 text-xs mt-1">{usernameErr}</p>}
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
        {passwordErr && <p className="w-[95%] mx-auto text-red-400 text-xs mt-1">{passwordErr}</p>}

      </div>

      {error && <p className="text-red-400 text-center text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="
          mt-6 w-[95%] max-w-[400px] mx-auto py-2 rounded-md
          bg-white/90 text-black font-semibold
          hover:bg-white
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isLoading ? "Loading..." : "Login"}
      </button>


      <div className="mt-4 w-[95%] max-w-[400px] mx-auto mr-5" >
        <div ref={googleBtnDivRef} className="w-full"></div>
      </div>


      {/*<p className="mt-4 text-center text-white/70 text-sm">
        Don't have an account?{" "}
        <span
          className="text-white font-bold cursor-pointer"
          onClick={onSwitchToRegister}
        >
          Register
        </span>
      </p>*/}
    </form>
  );
};
