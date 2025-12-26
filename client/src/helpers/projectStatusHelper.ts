import { ProjectStatus } from "../enums/ProjectStatus";

export const getProjectStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.ACTIVE:
      return "bg-green-500";
    case ProjectStatus.PAUSED:
      return "bg-yellow-500";
    case ProjectStatus.COMPLETED:
      return "bg-blue-500";
    case ProjectStatus.NOT_STARTED:
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export const getProjectStatusByDate = (
  startDate?: string | null
): ProjectStatus => {
  if (!startDate) {
    return ProjectStatus.NOT_STARTED;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  if (start > today) {
    return ProjectStatus.NOT_STARTED;
  }

  if (start.getTime() === today.getTime()) {
    return ProjectStatus.ACTIVE;
  }

  return ProjectStatus.ACTIVE;
};

