import { TaskDTO } from "../../models/task/TaskDTO";

export interface TaskListPageProps {
  projectId: string;
  token: string;
}

export interface TaskDetailPageProps {
  token: string;
  taskId: number;
  setClose: () => void;
  onEdit?: () => void;
}

export interface TaskBoardPageProps {
  projectId: string;
  token: string;
}
