import { Result } from '../../types/Result';
import { SprintDTO } from '../../external-dtos/SprintDTO';
import { ProjectUserDTO } from '../../external-dtos/ProjectUserDTO';
import { ProjectDTO } from '../../external-dtos/ProjectDTO';


export interface IProjectServiceClient {
    getSprintById(sprintId: number): Promise<Result<SprintDTO>>;
    getUsersForProject(projectId: number): Promise<Result<ProjectUserDTO[]>>;
    getProjectById(projectId: number): Promise<Result<ProjectDTO>>;
    projectExists(projectId: number): Promise<boolean>;
}