import { SprintDTO } from "../../models/sprint/SprintDto";

export interface SprintCreateDTO {
  sprint_title: string;
  sprint_description: string;
  start_date: string; 
  end_date: string;   
}

export interface ISprintAPI {
  getSprintsByProject(projectId: number): Promise<SprintDTO[]>;
  createSprint(projectId: number, data: SprintCreateDTO): Promise<SprintDTO>;
  deleteSprint(sprintId: number): Promise<void>;
}
