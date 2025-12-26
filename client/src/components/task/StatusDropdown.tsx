import React, { useState } from "react";
import { TaskStatus } from "../../enums/TaskStatus";
import { StatusBadge } from "./StatusBadge";

interface Props {
  currentStatus: TaskStatus;
  onStatusChange: (newStatus: TaskStatus) => void;
}

const StatusDropdown: React.FC<Props> = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = Object.values(TaskStatus);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
      >
        <StatusBadge status={currentStatus} />
        <svg className={`w-3 h-3 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-40 z-[70] bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-1.5 backdrop-blur-xl">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  onStatusChange(s);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center p-1 rounded-lg transition-colors ${s === currentStatus ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <StatusBadge status={s} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusDropdown;