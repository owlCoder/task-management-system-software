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

export const TaskTimeTracking:React.FC<TaskTimeTrackingProps> = ({taskId,token,role,task}) => {

    const apiTask = new TaskAPI(import.meta.env.VITE_GATEWAY_URL,token);
    const [total_hours_spent , setHours] = useState<number>(0);
    const [isEditing,setIsEditing] = useState(false);
   
    const handleUpdate  = async () => {
        if(role !== UserRole.PROJECT_MANAGER) return;

        const payload : UpdateTaskDTO = {total_hours_spent}
        if(role == UserRole.PROJECT_MANAGER){
          await apiTask.updateTask(taskId,payload)
        }
    }
    
    return (
        <div>
            {isEditing === false && 
            <>
                <div>{task.total_hours_spent ?? ""}</div>
                <button
                    disabled={role !== UserRole.PROJECT_MANAGER}
                    onClick={() => {setHours(task.total_hours_spent ?? 0);
                        setIsEditing(true);
                    }}
                    
                >
                    Edit
                </button>
            </>
            }
            {isEditing === true &&
            <>
            <input
                name="hours"
                placeholder="Edit total spent hours"
                value={total_hours_spent}
                onChange={(e) => {
                    if(total_hours_spent < 0) {
                        <label className="border-red">Total hours can't be negative.Try again</label>
                    }
                    setHours(e.target.valueAsNumber);
                }}
            />
            <button onClick={async() =>  {
                await handleUpdate();
                setIsEditing(false);
            }}>
                    Save
            </button>

            <button onClick={() => {
                setIsEditing(false);
                setHours(task.total_hours_spent ?? 0);
            }}>
                Cancel
            </button>
            </>
            }
        </div>
    );
}