import React from "react";
import { SortOption } from "../../types/SortOption";

interface TaskSortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const TaskSortSelect: React.FC<TaskSortSelectProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
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
      <option
        value="NEWEST"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        Newest
      </option>
      <option
        value="TITLE_ASC"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        Title A–Z
      </option>
      <option
        value="TITLE_DESC"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        Title Z–A
      </option>
      <option
        value="STATUS"
        className="bg-slate-900/95 backdrop-blur-xl text-white"
      >
        Status
      </option>
    </select>
  );
};

export default TaskSortSelect;
