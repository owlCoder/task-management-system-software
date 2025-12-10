import { ProjectStatus } from "../../enums/ProjectStatus";
import { ProjectUserDTO } from "./ProjectUserDTO";

export type ProjectDTO = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  members: ProjectUserDTO[];
  totalWeeklyHours?: number;
  allowedBudget?: number;
  status?: ProjectStatus;
  numberOfSprints?: number;     
  sprintDuration?: number;
  startDate?: string; 
};