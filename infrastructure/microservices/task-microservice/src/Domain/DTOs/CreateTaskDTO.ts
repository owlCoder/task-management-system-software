export interface CreateTaskDTO {
  title: string;
  description: string;  
  estimatedCost?: number;
  assignedTo: number;
}
