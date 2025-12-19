import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";

interface TaskHeaderProps {
    task : TaskDTO;
}

export const TaskHeader: React.FC<TaskHeaderProps>  = ({task}) => {

    return (
        <div className="flex justify-between font-bold" style={{fontFamily:"Questrial"}}>
            {task?.title}
            <label>User Dropdown</label>
            <label>Status Dropdown</label>
        </div>
    );
};