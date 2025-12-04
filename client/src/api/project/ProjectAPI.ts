import type { ProjectDTO } from "../../models/project/ProjectDTO";
import { IProjectAPI } from "./IProjectAPI";
import { mockProjects } from "../../mocks/ProjectsMock";

class ProjectAPI implements IProjectAPI {
  private projects: ProjectDTO[] = [...mockProjects];

  async getAllProjects(): Promise<ProjectDTO[]> {
    await this.delay(200);
    return [...this.projects];
  }

  async getProjectById(id: string): Promise<ProjectDTO | undefined> {
    await this.delay(100);
    return this.projects.find((p) => p.id === id);
  }

  async createProject(project: ProjectDTO): Promise<ProjectDTO> {
    const newProject = { ...project, id: Date.now().toString() };
    this.projects.push(newProject);
    await this.delay(150);
    return newProject;
  }

  async updateProject(id: string, updatedData: Partial<ProjectDTO>): Promise<ProjectDTO | undefined> {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.projects[index] = { ...this.projects[index], ...updatedData };
    await this.delay(150);
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    const lengthBefore = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    await this.delay(100);
    return this.projects.length < lengthBefore;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const projectAPI = new ProjectAPI();