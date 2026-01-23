import { CreateTaskDTO } from "../../models/task/CreateTaskDTO";
import { TaskDTO } from "../../models/task/TaskDTO";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";
import { ITaskAPI } from "./ITaskAPI";
import { CommentDTO } from "../../models/task/CommentDTO";
import { TaskVersionDTO } from "../../models/task/TaskVersionDTO";



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
    const res = await fetch(`${this.baseUrl}/tasks/projects/${projectId}`, {
      headers: this.headers,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tasks by project");
    }

    const json = await res.json();
    return json.data ?? json;
  }


  async getTasksBySprint(sprintId: number): Promise<TaskDTO[]> {
    try {
      const res = await fetch(`${this.baseUrl}/tasks/sprints/${sprintId}`, {
        headers: this.headers,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tasks by sprint");
      }

      const json = await res.json();
      return json.data ?? json;
    } catch (error) {
      console.error("Error fetching tasks by sprint:", error);
      throw error;
    }
  }

  async getTask(taskId: number): Promise<TaskDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        headers: this.headers,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch task");
      }

      const json = await res.json();
      return json.data ?? json;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
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
    try {
      const res = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(payload),
      });
      return res.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async updateTaskStatus(taskId: number, status: string,fileId : number): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify({status,file_id:fileId}),
      });

      if(!res.ok) {
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        method: "DELETE",
        headers: this.headers,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
async uploadComment(taskId: number,userId: number,text: string): Promise<CommentDTO> {
  try {
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
  } catch (error) {
    console.error('Error uploading comment:', error);
    throw error;
  }
}

async deleteComment(commentId:number,userId:number) : Promise<void>{
   try {
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
   } catch (error) {
     console.error('Error deleting comment:', error);
     throw error;
   }
}

async getTaskVersions(taskId: number): Promise<TaskVersionDTO[]> {
  try {
    const res = await fetch(`${this.baseUrl}/tasks/${taskId}/versions`, {
      headers: this.headers,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch task versions");
    }

    const json = await res.json();
    return json.data ?? json;
  } catch (error) {
    console.error("Error fetching task versions:", error);
    throw error;
  }
}

async getTaskVersion(taskId: number, versionId: number): Promise<TaskVersionDTO> {
  try {
    const res = await fetch(
      `${this.baseUrl}/tasks/${taskId}/versions/${versionId}`,
      {
        headers: this.headers,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch task version");
    }

    const json = await res.json();
    return json.data ?? json;
  } catch (error) {
    console.error("Error fetching task version:", error);
    throw error;
  }
}

}
