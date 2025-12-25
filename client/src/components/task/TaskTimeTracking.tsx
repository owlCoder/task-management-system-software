import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";

interface TaskTimeTrackingProps {
  task: TaskDTO;
}

export const TaskTimeTracking: React.FC<TaskTimeTrackingProps> = ({ task }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-1">
        Time Spent
      </h3>

      <span className="text-sm text-white/90 font-medium">
        {task.total_hours_spent ?? 0} h
      </span>
    </div>
  );
};
