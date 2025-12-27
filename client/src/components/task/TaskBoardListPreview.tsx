import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";
import { TaskStatus } from "../../enums/TaskStatus";
import TaskColumn from "./TaskColumn";

interface Props {
  tasks: TaskDTO[];
  onSelect: (taskId: number) => void;
  selectedTaskId: number | null;
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}

const TaskListPreview: React.FC<Props> = ({
  tasks,
  onSelect,
  selectedTaskId,
  onStatusChange
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
      />

      <TaskColumn
        title="Pending"
        status={TaskStatus.PENDING}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
      />

      <TaskColumn
        title="In Progress"
        status={TaskStatus.IN_PROGRESS}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
      />

      <TaskColumn
        title="Done"
        status={TaskStatus.COMPLETED}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
      />

      <TaskColumn
        title="Cancelled"
        status={TaskStatus.CANCELLED}
        tasks={tasks}
        onSelect={onSelect}
        selectedTaskId={selectedTaskId}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

export default TaskListPreview;
