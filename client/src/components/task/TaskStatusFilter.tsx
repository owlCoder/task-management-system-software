import React from "react";

interface TaskStatusFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const TaskStatusFilter: React.FC<TaskStatusFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="
        flex-1 sm:flex-none
        px-3 py-2
        rounded-lg
        bg-white/10
        border border-white/20
        text-white
        text-sm sm:text-base
        outline-none
      "
    >
      <option value="" className="bg-slate-900/95 backdrop-blur-xl text-white">
        All statuses
      </option>
      <option
        value="CREATED"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        Created
      </option>
      <option
        value="IN_PROGRESS"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        In Progress
      </option>
      <option
        value="DONE"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        Done
      </option>
      <option
        value="COMPLETED"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        Completed
      </option>
      <option
        value="PENDING"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        Pending
      </option>
    </select>
  );
};

export default TaskStatusFilter;
