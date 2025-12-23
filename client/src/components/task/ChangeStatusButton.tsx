import React from "react";
import { TaskStatus } from "../../enums/TaskStatus";

interface ChangeStatusButtonProps {
  currentStatus: TaskStatus;
  onStatusUpdate: (newStatus: TaskStatus) => void;
}

export const ChangeStatusButton: React.FC<ChangeStatusButtonProps> = ({ currentStatus, onStatusUpdate }) => {
  const getNextStatus = (status: TaskStatus): TaskStatus | null => {
    switch (status) {
      case TaskStatus.CREATED: return TaskStatus.PENDING;
      case TaskStatus.PENDING: return TaskStatus.IN_PROGRESS;
      case TaskStatus.IN_PROGRESS: return TaskStatus.COMPLETED;
      default: return null; 
    }
  };

  const nextStatus = getNextStatus(currentStatus);
  if (!nextStatus) return null; 

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); 
        onStatusUpdate(nextStatus);
      }}
      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all duration-300"
    >
      <span className="text-[9px] font-bold text-white/30 group-hover:text-blue-300 uppercase tracking-tighter transition-colors">
        Move to {nextStatus}
      </span>
      <svg className="w-3 h-3 text-white/20 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>
  );
};