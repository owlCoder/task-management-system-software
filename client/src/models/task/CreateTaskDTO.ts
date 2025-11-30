export interface CreateTaskDTO {
  title: string;
  description: string;
  estimatedCost: number;
  projectId: number;
  assignedTo?: number;
}
