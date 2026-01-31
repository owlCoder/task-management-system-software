import { TaskStatus } from "../../enums/TaskStatus";

export interface TaskListPageProps {
  projectId?: string;
}

export interface TaskDetailPageProps {
  token: string;
  taskId: number;
  setClose: () => void;
  onEdit?: () => void;
  onStatusUpdate?: (taskId: number, newStatus: TaskStatus) => void;
}

export interface TaskBoardPageProps {
  projectId: string;
  token: string;
}
