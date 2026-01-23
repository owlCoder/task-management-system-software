import React from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";

const StatusesPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-white">
          Hello World!
        </h1>
      </main>
    </div>
  );
};

export default StatusesPage;