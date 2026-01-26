import axios, { AxiosInstance } from "axios";
import { ProjectDTO, ProjectUserDTO, SprintDTO } from "./types";

export class ProjectServiceClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = process.env.PROJECT_SERVICE_API || "http://localhost:5000/api/v1") {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000
    });
  }

  async getProjectById(projectId: number): Promise<ProjectDTO | null> {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}`);
      return response.data as ProjectDTO;
    } catch {
      return null;
    }
  }

  async getSprintsByProject(projectId: number): Promise<SprintDTO[]> {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/sprints`);
      return (response.data ?? []) as SprintDTO[];
    } catch {
      return [];
    }
  }

  async getUsersForProject(projectId: number): Promise<ProjectUserDTO[]> {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/users`);
      return (response.data ?? []) as ProjectUserDTO[];
    } catch {
      return [];
    }
  }
}
