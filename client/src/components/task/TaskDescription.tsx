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
    <div>
      {!isEditing && (
        <>
          <div>{task.task_description}</div>

          <button
            disabled={role !== UserRole.PROJECT_MANAGER}
            onClick={() => {
              setDescription(task.task_description ?? "");
              setIsEditing(true);
            }}
          >
            Edit
          </button>
        </>
      )}

      {isEditing && (
        <>
          <textarea
            name="description"
            value={description}
            placeholder="Update Description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={async () => {
              await handleUpdate();
              setIsEditing(false);
            }}
          >
            Save
          </button>

          <button
            onClick={() => {
              setDescription(task.task_description ?? "");
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};