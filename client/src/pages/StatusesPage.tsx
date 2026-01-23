import React from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { ServiceStatus } from "../components/statuses/ServiceStatus";
import { ResponseTime } from "../components/statuses/ResponseTime";
import { Incidents } from "../components/statuses/Incidents";

const StatusesPage: React.FC = () => {
  return (
    <div className="h-screen flex overflow-y-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto styled-scrollbar  space-y-[8px] ">
        <h1 className="text-3xl md:text-4xl font-bold text-white ">Service Stautes</h1>
        <ServiceStatus/>
        <ResponseTime/>
        <Incidents/>
      </main>
    </div>
  );
};

export default StatusesPage;