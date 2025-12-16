import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";
import { TaskStatus } from "../../enums/TaskStatus";

interface TaskListItemProps {
  task: TaskDTO;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task }) => {
  return (
    <div className="bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition cursor-pointer">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-white">{task.title}</span>

        <span className="px-2 py-1 rounded-md text-xs bg-white/20 text-white/90">
          {task.task_status}
        </span>
      </div>

      <p className="text-white/70 mt-1 text-sm">{task.task_description}</p>

      <div className="flex justify-between mt-3 text-xs text-white/50">
        <span>Cost: {task.estimated_cost}¥</span>
        <span>Time: {task.total_hours_spent}h</span>
      </div>
    </div>
  );
};

export default TaskListItem;
