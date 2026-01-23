import axios, { AxiosInstance } from "axios";
import { ISprintAPI, SprintCreateDTO } from "./ISprintAPI";
import { SprintDTO } from "../../models/sprint/SprintDto";
import { readValueByKey } from "../../helpers/local_storage";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

export class SprintAPI implements ISprintAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: GATEWAY_URL,
    });

    this.client.interceptors.request.use((config) => {
      const token = readValueByKey("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getSprintsByProject(projectId: number): Promise<SprintDTO[]> {
    const res = await this.client.get<SprintDTO[]>(
      `/projects/${projectId}/sprints`
    );
    return res.data;
  }

  async createSprint(projectId: number, data: SprintCreateDTO): Promise<SprintDTO> {
    const res = await this.client.post<SprintDTO>(
      `/projects/${projectId}/sprints`,
      data
    );
    return res.data;
  }

  async deleteSprint(sprintId: number): Promise<void> {
    await this.client.delete(`/sprints/${sprintId}`);
  }
}

export const sprintAPI = new SprintAPI();
