import { ProjectCreateDTO } from "../DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../DTOs/ProjectUpdateDTO";
import { ProjectDTO } from "../DTOs/ProjectDTO";

export interface IProjectService {
    CreateProject(data: ProjectCreateDTO): Promise<ProjectDTO>;
    getProjects(): Promise<ProjectDTO[]>;
    getProjectById(project_id: number): Promise<ProjectDTO>;
    updateProject(project_id: number, data: ProjectUpdateDTO): Promise<ProjectDTO>;
    deleteProject(project_id: number): Promise<boolean>;
}