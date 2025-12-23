import React from "react";
import TaskListItem from "./TaskListItem";
import { mockTasks } from "../../mocks/TaskMock";

interface Props {
  onSelect: (taskId: number) => void;
}

const TaskListPreview: React.FC<Props> = ({onSelect}) => {
  return (
    <div className="flex flex-col gap-3 h-screen overflow-y-auto hide-scrollbar">
      {mockTasks.map((task) => (
        <TaskListItem onSelect={onSelect} key={task.task_id} task={task} />
      ))}
    </div>
  );
};

export default TaskListPreview;
