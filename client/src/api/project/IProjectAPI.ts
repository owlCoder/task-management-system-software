import { ProjectDTO } from "../../models/project/ProjectDTO";
import { ProjectCreateDTO } from "../../models/project/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../models/project/ProjectUpdateDTO";
import { ProjectUserDTO } from "../../models/project/ProjectUserDTO";

export interface IProjectAPI {
    getProjectsByUserId(userId: number): Promise<ProjectDTO[]>;
    getProjectById(projectId: number): Promise<ProjectDTO | null>;
    createProject(data: ProjectCreateDTO): Promise<ProjectDTO | null>;
    updateProject(projectId: number, data: ProjectUpdateDTO): Promise<ProjectDTO | null>;
    deleteProject(projectId: number): Promise<boolean>;
    
    getProjectUsers(projectId: number): Promise<ProjectUserDTO[]>;
    assignUserToProject(projectId: number, userId: number, weeklyHours: number): Promise<ProjectUserDTO>;
    removeUserFromProject(projectId: number, userId: number): Promise<boolean>;
}