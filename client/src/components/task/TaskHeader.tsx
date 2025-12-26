import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";
import { TaskStatus } from "../../enums/TaskStatus";
import { UserRole } from "../../enums/UserRole";
import StatusDropdown from "./StatusDropdown"; 
import { TaskAPI } from "../../api/task/TaskAPI";

interface TaskHeaderProps {
  task: TaskDTO;
  role: UserRole;
  token: string; 
  onStatusUpdate: (newStatus: TaskStatus) => void; 
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ task, role, token, onStatusUpdate }) => {
  
  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      const api = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);
      await api.updateTask(task.task_id, { status: newStatus });
      onStatusUpdate(newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status");
    }
  };

  return (
    <div className="px-6 py-5 flex items-center justify-between border-b border-white/10 bg-white/5">
      <div className="flex flex-col gap-1 max-w-[60%]">
        <h2 className="text-xl font-bold text-white truncate">
          {task.title}
        </h2>
        <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">
          Task ID: #{task.task_id}
        </span>
      </div>

      <div className="flex flex-col items-end gap-2">
        <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest mr-2">
          Change Status
        </label>
        
        <StatusDropdown 
          currentStatus={task.task_status as TaskStatus} 
          onStatusChange={handleStatusChange} 
        />
      </div>
    </div>
  );
};