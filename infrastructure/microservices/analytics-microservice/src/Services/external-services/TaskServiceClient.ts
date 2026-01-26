import axios, { AxiosInstance } from "axios";
import { ITaskServiceClient } from "./ITaskServiceClient";
import { TaskDTO } from "./types";

export class TaskServiceClient implements ITaskServiceClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = process.env.TASK_SERVICE_API || "http://localhost:12234/api/v1") {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000
    });
  }

  async getTasksBySprintIds(sprintIds: number[]): Promise<TaskDTO[]> {
    if (sprintIds.length === 0) {
      return [];
    }

    try {
      const response = await this.axiosInstance.post("/tasks/sprints/batch", {
        sprint_ids: sprintIds
      });
      return (response.data ?? []) as TaskDTO[];
    } catch {
      return [];
    }
  }
}
