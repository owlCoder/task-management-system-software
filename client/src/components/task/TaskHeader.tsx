import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";
import { TaskStatus } from "../../enums/TaskStatus";
import { UserRole } from "../../enums/UserRole";

interface TaskHeaderProps {
  task: TaskDTO;
  role: UserRole;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  CREATED: "bg-gray-500/20 text-gray-300 border-gray-400/30",
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  IN_PROGRESS: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  COMPLETED: "bg-green-500/20 text-green-300 border-green-400/30",
  CANCELLED: "bg-red-500/20 text-red-300 border-red-400/30",
};
export const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
  return (
    <div className="px-6 py-4 flex items-center border-b border-white/10">
      <h2 className="text-lg font-semibold text-white truncate max-w-[70%]">
        {task.title}
      </h2>

      <span
        className={`
          ml-auto
          px-3 py-1
          text-[11px]
          rounded-full
          uppercase
          tracking-wide
          border
          ${STATUS_COLORS[task.task_status]}
        `}
      >
        {task.task_status.replace("_", " ")}
      </span>
    </div>
  );
};
