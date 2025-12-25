import React from "react";
import { useState } from "react";
import { TaskAPI } from "../../api/task/TaskAPI";
import { TaskDTO } from "../../models/task/TaskDTO";
import { UserRole } from "../../enums/UserRole";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";

interface TaskDescriptionProps {
    token : string;
    taskId : number;
    role : UserRole
    task : TaskDTO;
}

export const TaskDescription : React.FC<TaskDescriptionProps> = ({token,taskId,role,task}) => {

    const apiTask = new TaskAPI(import.meta.env.VITE_GATEWAY_URL,token);
    const [description, setDescription] = useState("");
    const [isEditing,setIsEditing] = useState(false);


    const handleUpdate = async () => {
        if (role !== UserRole.PROJECT_MANAGER) return;

        const payload: UpdateTaskDTO = { description };
        await apiTask.updateTask(taskId, payload);
    }

  return (
  <div className="relative bg-white/5 border border-white/10 rounded-xl p-3 pb-8">
    <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-1">
      Description
    </h3>

    {!isEditing ? (
      <>
        <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
          {task.task_description || "No description provided"}
        </p>

        {role === UserRole.PROJECT_MANAGER && (
          <button
            onClick={() => {
              setDescription(task.task_description ?? "");
              setIsEditing(true);
            }}
            className="
              absolute bottom-3 right-3
              px-3 py-1.5
              rounded-lg
              text-xs font-semibold
              text-blue-300
              bg-blue-500/10
              border border-blue-400/20
              hover:bg-blue-500/20
              hover:border-blue-400/40
              hover:scale-[1.05]
              transition-all duration-200
            "
          >
            ✎ Edit
          </button>
        )}
      </>
    ) : (
      <>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
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

        <div className="flex gap-3 mt-3">
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
              transition-all
            "
          >
            Save
          </button>

          <button
            onClick={() => {
              setDescription(task.task_description ?? "");
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