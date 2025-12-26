import React from "react";
import { TaskStatus } from "../../enums/TaskStatus";

const getStatusConfig = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return {
        container: "bg-red-950/40 text-red-400 border-red-500/50",
        dot: "bg-red-500 shadow-red-500/50"
      };
    case TaskStatus.PENDING:
      return {
        container: "bg-yellow-950/40 text-yellow-400 border-yellow-500/50",
        dot: "bg-yellow-500 shadow-yellow-500/50"
      };
    case TaskStatus.COMPLETED:
      return {
        container: "bg-blue-950/40 text-blue-400 border-blue-500/50",
        dot: "bg-blue-500 shadow-blue-500/50"
      };
    case TaskStatus.CREATED:
      return {
        container: "bg-black/40 text-[#4ade80] border-[#4ade80]/50",
    dot: "bg-[#4ade80] shadow-[0_0_10px_#4ade80]"
      };
    case TaskStatus.CANCELLED:
      return {
        container: "bg-gray-900/40 text-gray-300 border-gray-500/50",
        dot: "bg-gray-400"
      };
    default:
      return {
        container: "bg-slate-900/40 text-slate-400 border-slate-500/20",
        dot: "bg-slate-500"
      };
  }
};

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const config = getStatusConfig(status);

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 
      rounded-md text-[10px] font-extrabold uppercase tracking-wider border 
      bg-black/20 shadow-lg shadow-black/20 bg-slate-750/90 shadow-xl
      ${config.container}
    `}>
      <span className={`w-2 h-2 rounded-full ${config.dot} shadow-[0_0_8px_currentColor]`}></span>
      {status}
    </span>
  );
};