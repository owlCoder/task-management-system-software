import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";
//import { TaskStatus } from "../../enums/TaskStatus";
import { StatusBadge } from "./StatusBadge";

interface TaskListItemProps {
  task: TaskDTO;
  onSelect?: (taskId: number) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task,onSelect }) => {
  return (
    <div onClick={() => {
  if (onSelect) {
    onSelect(task.task_id);
  }
}} className="bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition cursor-pointer">
      <div  className="flex justify-between items-center">
        <span className="font-bold text-white text-xl">{task.title}</span>

        <StatusBadge status={task.task_status} />
      </div>

      <p className="text-white/70 mt-1 text-sm">{task.task_description}</p>

      <div className="flex justify-between mt-3 text-xs text-white/50">
        <span>Cost: {task.estimated_cost}¥</span>
        <span className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Time: {task.total_hours_spent}h
        </span>
      </div>
    </div>
  );
};

export default TaskListItem;
