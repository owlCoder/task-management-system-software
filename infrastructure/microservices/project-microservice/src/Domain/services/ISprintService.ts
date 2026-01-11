import { SprintCreateDTO } from "../DTOs/SprintCreateDTO";
import { SprintDTO } from "../DTOs/SprintDTO";
import { SprintUpdateDTO } from "../DTOs/SprintUpdateDTO";
import { Result } from "../types/Result";

export interface ISprintService {
    createSprint(data: SprintCreateDTO): Promise<Result<SprintDTO>>;
    getSprintsByProject(project_id: number): Promise<Result<SprintDTO[]>>;
    getSprintById(sprint_id: number): Promise<Result<SprintDTO>>;
    updateSprint(sprint_id: number, data: SprintUpdateDTO): Promise<Result<SprintDTO>>;
    deleteSprint(sprint_id: number): Promise<Result<boolean>>;
}