import axios, { AxiosInstance, AxiosError } from "axios";
import { IProjectAPI } from "./IProjectAPI";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import { ProjectCreateDTO } from "../../models/project/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../models/project/ProjectUpdateDTO";
import { readValueByKey } from "../../helpers/local_storage";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

class ProjectAPIImpl implements IProjectAPI {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: GATEWAY_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = readValueByKey("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized - token expired or invalid");
        } else if (error.response?.status === 403) {
          console.error("Forbidden - insufficient permissions");
        }
        return Promise.reject(error);
      }
    );
  }

  async getProjectsByUserId(userId: number): Promise<ProjectDTO[]> {
    try {
      const response = await this.client.get<ProjectDTO[]>(`/users/${userId}/projects`);
      return response.data;
    } catch (error) {
      console.error("Error fetching projects by user ID:", error);
      throw error;
    }
  }

  async getProjectById(projectId: number): Promise<ProjectDTO | null> {
    try {
      const response = await this.client.get<ProjectDTO>(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching project by ID:", error);
      return null;
    }
  }

  async createProject(data: ProjectCreateDTO): Promise<ProjectDTO | null> {
    try {
      const response = await this.client.post<ProjectDTO>("/projects", data);
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async updateProject(projectId: number, data: ProjectUpdateDTO): Promise<ProjectDTO | null> {
    try {
      const response = await this.client.put<ProjectDTO>(`/projects/${projectId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  async deleteProject(projectId: number): Promise<boolean> {
    try {
      await this.client.delete(`/projects/${projectId}`);
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      return false;
    }
  }
}

export const projectAPI: IProjectAPI = new ProjectAPIImpl();