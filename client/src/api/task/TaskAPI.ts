import { CreateTaskDTO } from "../../models/task/CreateTaskDTO";
import { TaskDTO } from "../../models/task/TaskDTO";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";
import { ITaskAPI } from "./ITaskAPI";

export class TaskAPI implements ITaskAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
  }

  async getTasksByProject(projectId: string): Promise<TaskDTO[]> {
    const res = await fetch(`${this.baseUrl}/task/project/${projectId}`, {
      headers: this.headers,
    });
    return res.json();
  }

  async getTask(taskId: string): Promise<TaskDTO> {
    const res = await fetch(`${this.baseUrl}/task/${taskId}`, {
      headers: this.headers,
    });
    return res.json();
  }

  async createTask(payload: CreateTaskDTO): Promise<TaskDTO> {
    const res = await fetch(`${this.baseUrl}/task`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async updateTask(taskId: string, payload: UpdateTaskDTO): Promise<TaskDTO> {
    const res = await fetch(`${this.baseUrl}/task/${taskId}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async deleteTask(taskId: string): Promise<void> {
    await fetch(`${this.baseUrl}/task/${taskId}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }
}
