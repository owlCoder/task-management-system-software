import { TaskStatus } from "../enums/task_status";

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  estimatedCost?: number;
  status?: TaskStatus;
  assignedTo?: number;
}