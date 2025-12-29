import { TaskStatus } from "../../enums/TaskStatus";

// StatusBadge Props
export interface StatusBadgeProps {
  status: TaskStatus;
}

// StatusDropdown Props
export interface StatusDropdownProps {
  currentStatus: TaskStatus;
  onStatusChange: (newStatus: TaskStatus) => void;
}
