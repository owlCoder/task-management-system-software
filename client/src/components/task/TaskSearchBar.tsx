import React from "react";

interface TaskSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TaskSearchBar: React.FC<TaskSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search tasks...",
}) => {
  return (
    <div className="w-full max-w-md md:max-w-xs">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          px-5
          py-2.5  
          rounded-3xl
          bg-white/10
          border
          border-white/20
          text-white
          placeholder-white/50
          outline-none
          focus:border-white/40
          focus:bg-white/20
          transition
          
        "
      />
    </div>
  );
};

export default TaskSearchBar;
