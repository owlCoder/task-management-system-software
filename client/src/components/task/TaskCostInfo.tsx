import React, { useEffect } from "react";
import { TaskDTO } from "../../models/task/TaskDTO";

interface TaskTimeTrackingProps {
    task : TaskDTO;
}

export const TaskCostInfo :React.FC<TaskTimeTrackingProps> = ({task}) => {
    return (
        <div>
           {task?.estimated_cost }
        </div>
    );
}