import React from "react";
import TaskListItem from "./TaskListItem";
import { mockTasks } from "../../mocks/TaskMock";

const TaskListPreview: React.FC = () => {
  return (
    <div className="flex flex-col gap-3">
      {mockTasks.map((task) => (
        <TaskListItem key={task.task_id} task={task} />
      ))}
    </div>
  );
};

export default TaskListPreview;
