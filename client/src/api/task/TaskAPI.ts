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

  async getTask(taskId: number): Promise<TaskDTO> {
  const res = await fetch(`${this.baseUrl}/api/v1/tasks/${taskId}`, {
    headers: this.headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }

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

  async updateTask(taskId: number, payload: UpdateTaskDTO): Promise<TaskDTO> {
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

 async uploadFile(taskId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await fetch(`${this.baseUrl}/task/${taskId}/file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${this.token}`,
    },
    body: formData
  });
}

async uploadComment(taskId: number,userId: number,comment: string): Promise<void> {
  const response = await fetch(
    `${this.baseUrl}/tasks/${taskId}/comments`,
    {
      method: "POST",
      headers: {
        ...this.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        comment: comment,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add comment");
  }
}

}