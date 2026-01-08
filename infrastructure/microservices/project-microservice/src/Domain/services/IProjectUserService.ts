import { ProjectUserAssignDTO } from "../DTOs/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../DTOs/ProjectUserDTO";

export interface IProjectUserService {
    assignUserToProject(data: ProjectUserAssignDTO): Promise<ProjectUserDTO>;
    removeUserFromProject(project_id: number, user_id: number): Promise<boolean>;
    getUsersForProject(project_id: number): Promise<ProjectUserDTO[]>;
}