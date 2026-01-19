import { TaskDTO } from "../../models/task/TaskDTO";
import { TaskStatus } from "../../enums/TaskStatus";
import { ProjectUserDTO } from "../../models/project/ProjectUserDTO";
import { UserRole } from "../../enums/UserRole";
import { CommentDTO } from "../../models/task/CommentDTO";
import { TaskVersionDTO } from "../../models/task/TaskVersionDTO";

// TaskListItem Props
export interface TaskListItemProps {
  task: TaskDTO;
  onSelect?: (taskId: number) => void;
  onStatusChange?: (taskId: number, newStatus: TaskStatus) => void;
  users?: ProjectUserDTO[];
}

// TaskColumn Props
export interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: TaskDTO[];
  onSelect: (taskId: number) => void;
  selectedTaskId: number | null;
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}

// TaskBoardListPreview Props
export interface TaskBoardListPreviewProps {
  tasks: TaskDTO[];
  onSelect: (taskId: number) => void;
  selectedTaskId: number | null;
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}

// TaskListPreview Props
export interface TaskListPreviewProps {
  tasks: TaskDTO[];
  onSelect: (taskId: number) => void;
}

// TaskListItem Props
export interface TaskListItemProps {
  task: TaskDTO;
  onSelect?: (taskId: number) => void;
  onStatusChange?: (taskId: number, newStatus: TaskStatus) => void;
  users?: ProjectUserDTO[];
}

// TaskHeader Props
export interface TaskHeaderProps {
  task: TaskDTO;
  role: UserRole;
  token: string;
  onStatusUpdate: (newStatus: TaskStatus) => void;
}

// TaskDescription Props
export interface TaskDescriptionProps {
  token: string;
  taskId: number;
  role: UserRole;
  task: TaskDTO;
}

// TaskTimeTracking Props
export interface TaskTimeTrackingProps {
  task: TaskDTO;
}

// TaskCostInfo Props
export interface TaskCostInfoProps {
  token: string;
  taskId: number;
  role: UserRole;
  task: TaskDTO;
}

export interface TaskCommentInputProps {
  onSubmit: (text: string) => Promise<void>;
};

// TaskCommentList Props
export interface TaskCommentListProps {
  comments : CommentDTO[];
  onDelete: (id : number) => Promise<void>;
}

// TaskSearchBar Props
export interface TaskSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// TaskStatusFilter Props
export interface TaskStatusFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

// TaskSortSelect Props
export interface TaskSortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export interface TaskVersionDiffProps {
  versions: TaskVersionDTO[];
}
