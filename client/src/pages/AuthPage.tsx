import React, { /*useState*/ } from "react";
import { IAuthAPI } from "../api/auth/IAuthAPI";
import { LoginForm } from "../components/auth/LoginForm";
//import { RegisterForm } from "../components/auth/RegisterForm";

type AuthPageProps = {
  authAPI: IAuthAPI;
};

const backgroundImageUrl = new URL(
  "../../public/background.png",
  import.meta.url
).href;

export const AuthPage: React.FC<AuthPageProps> = ({ authAPI }) => {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="flex flex-1 justify-center items-center px-4">
        <div
          className="
            w-[500px] max-w-[90vw]
            max-h-[calc(100vh-60px)]
            bg-white/10 backdrop-blur-xl
            shadow-[-4px_0_25px_rgba(0,0,0,0.25)]
            text-white
            rounded-3xl
            overflow-y-auto
            hide-scrollbar
          "
        >
          <div className="px-10 py-12">
              <LoginForm authAPI={authAPI}
              />
          </div>
        </div>
      </div>
    </div>
  );
};
