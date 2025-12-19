import { TaskStatus } from "../../enums/TaskStatus";

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  estimatedCost?: number;
  status?: TaskStatus;
  assignedTo?: number;
  total_hours_spent?: number;
}
