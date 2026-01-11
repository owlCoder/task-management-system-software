import { UserRole } from "../../enums/UserRole";
import { TaskDTO } from "../../models/task/TaskDTO";

// CreateTaskModal Props
export interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  token: string;
}

// EditTaskModal Props
export interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: TaskDTO;
  token: string;
  projectId: number;
}

// FileUpload Props
export interface FileUploadProps {
  setFile: (file: File) => void;
  uploadedFileName?: string | null;
}

// FilePreview Props
export interface FilePreviewProps {
  file: File | undefined;
  isUpload: () => void;
  setClose: () => void;
  role : UserRole;
}
