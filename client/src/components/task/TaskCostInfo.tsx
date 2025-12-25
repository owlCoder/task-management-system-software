import React from "react";
import { useState } from "react";
import { TaskAPI } from "../../api/task/TaskAPI";
import { TaskDTO } from "../../models/task/TaskDTO";
import { UserRole } from "../../enums/UserRole";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";

interface TaskTimeTrackingProps {
    token : string;
    taskId : number;
    role : UserRole;
    task : TaskDTO
}

export const TaskCostInfo :React.FC<TaskTimeTrackingProps> = ({task,token,taskId,role}) => {
   
    const apiTask = new TaskAPI(import.meta.env.VITE_GATEWAY_URL,token);
    const [estimatedCost , setEstimatedCost] = useState<number>(0);
    const [isEditing,setIsEditing] = useState(false);

     const handleUpdate  = async () => {
        if(role !== UserRole.PROJECT_MANAGER) return;
    
        const payload : UpdateTaskDTO = {estimatedCost}
        if(role == UserRole.PROJECT_MANAGER){
            await apiTask.updateTask(taskId,payload)
        }
    }


return (
  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
  <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-1">
    Estimated Cost
  </h3>

  {!isEditing ? (
    <div className="flex items-center justify-between">
      <span className="text-xl font-bold text-white">
        ${task.estimated_cost ?? 0}
      </span>

      {role === UserRole.PROJECT_MANAGER && (
        <button
  onClick={() => {
    setEstimatedCost(task.estimated_cost ?? 0);
    setIsEditing(true);
  }}
  className="
    mt-3
    inline-flex items-center gap-2
    px-3 py-1.5
    rounded-lg
    text-xs font-semibold
    text-blue-300
    bg-blue-500/10
    border border-blue-400/20
    hover:bg-blue-500/20
    hover:border-blue-400/40
    hover:scale-[1.02]
    transition-all duration-200
  "
>
  ✎ Edit
</button>

      )}
    </div>
    ) : (
      <>
        <input
          type="number"
          value={estimatedCost}
          onChange={(e) => setEstimatedCost(e.target.valueAsNumber)}
          className="
            w-full
            bg-black/30
            border border-white/10
            rounded-lg
            p-3
            text-sm text-white
            outline-none
            focus:ring-2 focus:ring-blue-500/40
          "
        />

<div className="flex gap-3 mt-4">
  <button
    onClick={async () => {
      await handleUpdate();
      setIsEditing(false);
    }}
    className="
      px-4 py-1.5
      rounded-lg
      text-xs font-semibold
      text-white
      bg-gradient-to-t
      from-blue-500 to-blue-600
      hover:from-blue-600 hover:to-blue-700
      hover:scale-[1.02]
      transition-all duration-200
      shadow-lg shadow-blue-500/20
    "
  >
    Save
  </button>

  <button
    onClick={() => {
      setEstimatedCost(task.estimated_cost ?? 0);
      setIsEditing(false);
    }}
    className="
      px-4 py-1.5
      rounded-lg
      text-xs
      text-white/70
      bg-white/5
      border border-white/10
      hover:bg-white/10
      hover:text-white
      transition-all duration-200
    "
  >
    Cancel
  </button>
</div>

      </>
    )}
  </div>
);
};