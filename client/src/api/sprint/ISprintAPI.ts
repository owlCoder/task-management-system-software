import { SprintDTO } from "../../models/sprint/SprintDto";

export interface ISprintAPI {
  getSprintsByProject(projectId: number): Promise<SprintDTO[]>;
}
