import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";
import { TaskStatus } from "../../enums/TaskStatus";

interface TaskListItemProps {
  task: TaskDTO;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task }) => {
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.IN_PROGRESS:
        return "bg-red-500";
      case TaskStatus.PENDING:
        return "bg-yellow-500";
      case TaskStatus.COMPLETED:
        return "bg-blue-500";
      case TaskStatus.CREATED:
        return "bg-green-500";
      case TaskStatus.CANCELLED:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition cursor-pointer">
      <div className="flex justify-between items-center">
        <span className="font-bold text-white text-xl">{task.title}</span>

        <span className="px-2 py-1 rounded-md text-xs bg-white/20 text-white/90 flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${getStatusColor(
              task.task_status
            )}`}
          ></span>
          {task.task_status}
        </span>
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
