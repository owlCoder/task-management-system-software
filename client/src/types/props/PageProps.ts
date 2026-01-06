
export interface TaskListPageProps {
  projectId: string;
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
