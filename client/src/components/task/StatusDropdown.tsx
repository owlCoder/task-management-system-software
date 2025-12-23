import React from "react";
import { TaskStatus } from "../../enums/TaskStatus";

interface StatusDropdownProps {
  currentStatus: TaskStatus;
  onStatusChange: (newStatus: TaskStatus) => void;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, onStatusChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold ml-1">
        Update Status
      </label>
      <select
        value={currentStatus}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        className="w-full px-4 py-3 rounded-xl text-white bg-black/40 backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer appearance-none shadow-inner"
      >
        <option value={TaskStatus.CREATED} className="bg-slate-900 text-green-400">CREATED</option>
        <option value={TaskStatus.PENDING} className="bg-slate-900 text-yellow-400">PENDING</option>
        <option value={TaskStatus.IN_PROGRESS} className="bg-slate-900 text-red-400">IN PROGRESS</option>
        <option value={TaskStatus.COMPLETED} className="bg-slate-900 text-blue-400">COMPLETED</option>
        <option value={TaskStatus.CANCELLED} className="bg-slate-900 text-gray-400">CANCELLED</option>
      </select>
    </div>
  );
};