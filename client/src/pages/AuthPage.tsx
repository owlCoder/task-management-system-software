import React, { useState } from "react";
import { IAuthAPI } from "../api/auth/IAuthAPI";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";
import Navbar from "../components/dashboard/navbar/Navbar";

type AuthPageProps = {
  authAPI: IAuthAPI;
};

const backgroundImageUrl = new URL(
  "../../public/pozadina.png",
  import.meta.url
).href;

export const AuthPage: React.FC<AuthPageProps> = ({ authAPI }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");


  
  return (
    <>
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="flex flex-1 justify-center items-stretch">
        <div
          className="
            w-[500px] max-w-[90vw]
            bg-white/10 backdrop-blur-xl
            shadow-[-4px_0_25px_rgba(0,0,0,0.25)]
            flex flex-col justify-center items-center
            text-white px-10 py-12 gap-6 rounded-3xl
          "
          style={{ marginRight: 30, marginTop: 30, marginBottom: 30 }}
        >
          {activeTab === "login" ? (
            <LoginForm
              authAPI={authAPI}
              onSwitchToRegister={() => setActiveTab("register")}
            />
          ) : (
            <RegisterForm
              authAPI={authAPI}
              onSwitchToLogin={() => setActiveTab("login")}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
};
