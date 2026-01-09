import React from "react";
import { TaskListPreviewProps } from "../../types/props";
import TaskListItem from "./TaskListItem";


const TaskListPreview: React.FC<TaskListPreviewProps> = ({tasks,  onSelect }) => {
  return (
    <div className="flex flex-col gap-3 h-screen overflow-y-auto hide-scrollbar">
      {tasks.length === 0 ? (
        <div className="text-white/20 text-center py-10">No tasks found.</div>
      ) : (
        tasks.map((task) => (
          <TaskListItem 
            onSelect={() => onSelect(task.task_id)} 
            key={task.task_id} 
            task={task} 
          />
        ))
      )}
    </div>
  );
};

export default TaskListPreview;
