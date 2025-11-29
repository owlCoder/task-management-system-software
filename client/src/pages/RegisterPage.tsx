import React from "react";
import { IAuthAPI } from "../api/auth/IAuthAPI";
import { RegisterForm } from "../components/auth/RegisterForm";
import Navbar from "../components/dashboard/navbar/Navbar";

const backgroundImageUrl = new URL(
  "../../public/background.png",
  import.meta.url
).href;

type RegisterPageProps = {
  authAPI: IAuthAPI;
};

export const RegisterPage: React.FC<RegisterPageProps> = ({ authAPI }) => {
  return (
    <>
      <Navbar />
      <div
        className="w-screen h-screen bg-cover bg-center bg-no-repeat flex"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="flex flex-1 justify-end items-stretch">
          <div
            className="
              w-[500px] max-w-[90vw]
              bg-white/10 backdrop-blur-xl
              shadow-[-4px_0_25px_rgba(0,0,0,0.25)]
              flex flex-col justify-center items-center
              text-white px-10 py-12 gap-6
            "
            style={{ marginRight: 30, marginTop: 30, marginBottom: 30 }}
          >
            <RegisterForm authAPI={authAPI} />
          </div>
        </div>
      </div>
    </>
  );
};