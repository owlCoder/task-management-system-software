import { TaskStatus } from "../../enums/task/TaskStatus";

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    estimatedCost?: number;
    status?: TaskStatus;
    assignedTo?: number;
}