import { CreateTaskDTO } from "../../models/task/CreateTaskDTO";
import { TaskDTO } from "../../models/task/TaskDTO";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";
import { ITaskAPI } from "./ITaskAPI";
import { CommentDTO } from "../../models/task/CommentDTO";


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

  async getTasksByProject(sprintId: string): Promise<TaskDTO[]> {
    const testSprintId = "1"; 
    const res = await fetch(`${this.baseUrl}/tasks/sprints/${testSprintId}`, {
    headers: this.headers,
  });
   if (!res.ok) {
    throw new Error("Failed to fetch task");
  }

  const json = await res.json();
  return json.data ?? json;
  }

  async getTask(taskId: number): Promise<TaskDTO> {
  const res = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
    headers: this.headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }

  const json = await res.json();
  return json.data ?? json;
}

  async createTask(payload: CreateTaskDTO): Promise<TaskDTO> {
    const testSprint = "1";
    const res = await fetch(`${this.baseUrl}/tasks/sprints/${testSprint}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async updateTask(taskId: number, payload: UpdateTaskDTO): Promise<TaskDTO> {
    const res = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async deleteTask(taskId: string): Promise<void> {
    await fetch(`${this.baseUrl}/tasks/${taskId}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }
async uploadComment(taskId: number,userId: number,text: string): Promise<CommentDTO> {
  const res = await fetch(`${this.baseUrl}/tasks/${taskId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        userId,
        comment: text,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload comment");
  }

  const json = await res.json();
  return json; 
}

async deleteComment(commentId:number,userId:number) : Promise<void>{
   const res = await fetch(`${this.baseUrl}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      ...this.headers,
      "x-user-id": userId.toString(),
    },
   });

   if(!res.ok){
    throw new Error("Failed to delete comment");
   }
}

}