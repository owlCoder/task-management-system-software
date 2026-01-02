import { ProjectDTO } from "../../models/project/ProjectDTO";
import { ProjectCreateDTO } from "../../models/project/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../models/project/ProjectUpdateDTO";

export interface IProjectAPI {
  getProjectsByUserId(userId: number): Promise<ProjectDTO[]>;
  getProjectById(projectId: number): Promise<ProjectDTO | null>;
  createProject(data: ProjectCreateDTO): Promise<ProjectDTO | null>;
  updateProject(projectId: number, data: ProjectUpdateDTO): Promise<ProjectDTO | null>;
  deleteProject(projectId: number): Promise<boolean>;
}