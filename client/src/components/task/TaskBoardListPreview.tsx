import React from "react";
import { TaskBoardListPreviewProps } from "../../types/props";
import { TaskStatus } from "../../enums/TaskStatus";
import TaskColumn from "./TaskColumn";

const TaskListPreview: React.FC<TaskBoardListPreviewProps> = ({
  tasks,
  onSelect,
  selectedTaskId,
  onStatusChange,
  users,
}) => {
  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-6 custom-scrollbar items-start">
      <TaskColumn
        title="To Do"
        status={TaskStatus.CREATED}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
        users={users}
      />

      <TaskColumn
        title="Pending"
        status={TaskStatus.PENDING}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
        users={users}
      />

      <TaskColumn
        title="In Progress"
        status={TaskStatus.IN_PROGRESS}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
        users={users}
      />

      <TaskColumn
        title="Done"
        status={TaskStatus.COMPLETED}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
        users={users}
      />

      <TaskColumn
        title="Cancelled"
        status={TaskStatus.CANCELLED}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
        users={users}
      />
    </div>
  );
};

export default TaskListPreview;
