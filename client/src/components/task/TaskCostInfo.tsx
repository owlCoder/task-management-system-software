import React from "react";
import { TaskCostInfoProps } from "../../types/props";

export const TaskCostInfo: React.FC<TaskCostInfoProps> = ({ task }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-1">
        Estimated Cost
      </h3>

      <span className="text-xl font-bold text-white">
        ${task.estimated_cost ?? 0}
      </span>
    </div>
  );
};
