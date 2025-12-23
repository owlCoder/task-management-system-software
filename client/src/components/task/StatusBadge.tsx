import React from "react";
import { TaskStatus } from "../../enums/TaskStatus";

const getStatusStyles = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return "bg-red-500/20 text-red-200 border-red-500/40";
    case TaskStatus.PENDING:
      return "bg-yellow-500/20 text-yellow-200 border-yellow-500/40";
    case TaskStatus.COMPLETED:
      return "bg-blue-500/20 text-blue-200 border-blue-500/40";
    case TaskStatus.CREATED:
      return "bg-green-500/20 text-green-200 border-green-500/40";
    case TaskStatus.CANCELLED:
      return "bg-gray-500/20 text-gray-300 border-gray-500/40";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};