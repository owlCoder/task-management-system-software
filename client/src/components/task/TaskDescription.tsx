import React from "react";
import { TaskDescriptionProps } from "../../types/props";

export const TaskDescription: React.FC<TaskDescriptionProps> = ({ task }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-1">
        Description
      </h3>

      <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
        {task.task_description || "No description provided"}
      </p>
    </div>
  );
};
