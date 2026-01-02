import React from "react";
import { TaskListPreviewProps } from "../../types/props";
import TaskListItem from "./TaskListItem";
import { mockTasks } from "../../mocks/TaskMock";

const TaskListPreview: React.FC<TaskListPreviewProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col gap-3 h-screen overflow-y-auto hide-scrollbar">
      {mockTasks.map((task) => (
        <TaskListItem onSelect={onSelect} key={task.task_id} task={task} />
      ))}
    </div>
  );
};

export default TaskListPreview;
