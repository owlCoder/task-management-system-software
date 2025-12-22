import { ProjectStatus } from "../enums/ProjectStatus";

export const getProjectStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.ACTIVE:
      return "bg-green-500";
    case ProjectStatus.PAUSED:
      return "bg-yellow-500";
    case ProjectStatus.COMPLETED:
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};
