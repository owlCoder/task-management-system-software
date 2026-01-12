import { ProjectUserAssignDTO } from "../DTOs/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../DTOs/ProjectUserDTO";
import { Result } from "../types/Result";

export interface IProjectUserService {
    assignUserToProject(data: ProjectUserAssignDTO): Promise<Result<ProjectUserDTO>>;
    removeUserFromProject(project_id: number, user_id: number): Promise<Result<boolean>>;
    getUsersForProject(project_id: number): Promise<Result<ProjectUserDTO[]>>;
    updateWeeklyHoursForAllUsers(project_id: number, oldHours: number, newHours: number): Promise<Result<void>>;
}