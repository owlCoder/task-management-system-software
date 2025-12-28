import { SprintCreateDTO } from "../DTOs/SprintCreateDTO";
import { SprintDTO } from "../DTOs/SprintDTO";
import { SprintUpdateDTO } from "../DTOs/SprintUpdateDTO";

export interface ISprintService {
    createSprint(data: SprintCreateDTO): Promise<SprintDTO>;
    getSprintsByProject(project_id: number): Promise<SprintDTO[]>;
    getSprintById(sprint_id: number): Promise<SprintDTO>;
    updateSprint(sprint_id: number, data: SprintUpdateDTO): Promise<SprintDTO>;
    deleteSprint(sprint_id: number): Promise<boolean>;
}