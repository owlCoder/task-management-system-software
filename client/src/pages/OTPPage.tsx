import React, { useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuthHook";

const backgroundImageUrl = new URL(
  "../../public/pozadina.png",
  import.meta.url
).href;

export const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(8).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const session = (location.state as any)?.session;

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const otpValue = otp.join("");

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onVerify = async () => {
  if (otpValue.length !== 8) return;

  try {
    setError("");

    const res = await fetch(`${import.meta.env.VITE_GATEWAY_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, code: otpValue }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}`);
    }

    if(data?.token) {
      login(data.token);
      navigate("/mainwindow");
      return;
    }
        
    setError("Verification has passed. But no token received.");

  } catch (e: any) {
    setError(e?.message || "Verification failed.");
  }
};

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div
        className="
          w-[700px] h-[220px]
          bg-white/10 backdrop-blur-xl
          rounded-2xl
          shadow-xl
          flex flex-col justify-center items-center
          gap-6
          text-white
        "
      >
        <h2 className="text-xl font-semibold tracking-wide">
          Enter OTP Code
        </h2>

        <div className="flex gap-3">
          {otp.map((digit, index) => (
            <div
              key={index}
              className="
                w-14 h-16
                bg-white/15 backdrop-blur-md
                rounded-xl
                flex items-center justify-center
              "
            >
              <input
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="
                  w-full h-full
                  bg-transparent
                  text-center
                  text-2xl
                  outline-none
                  text-white
                "
              />
            </div>
          ))}
        </div>

        <button
          onClick={onVerify}
          disabled={otpValue.length !== 8}
          className="
            mt-2 w-[45%] py-2 rounded-md
            bg-white/90 text-black font-semibold
            hover:bg-white disabled:opacity-50
          "
        >
          Verify Code
        </button>
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
      </div>
    </div>
  );
};
