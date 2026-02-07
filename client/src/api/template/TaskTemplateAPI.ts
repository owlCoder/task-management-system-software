import { ITaskTemplateAPI } from "./ITaskTemplateAPI";
import { TaskTemplateDTO } from "../../models/task/TaskTemplateDTO";
import { CreateTemplateDTO } from "../../models/task/CreateTemplateDTO";

export class TaskTemplateAPI implements ITaskTemplateAPI {
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

  async getTemplates(): Promise<TaskTemplateDTO[]> {
    try {
      const res = await fetch(`${this.baseUrl}/templates`, {
        headers: this.headers,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch templates");
      }

      const json = await res.json();
      return json.data ?? json;
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  }

  async getTemplate(templateId: number): Promise<TaskTemplateDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/templates/${templateId}`, {
        headers: this.headers,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch template");
      }

      const json = await res.json();
      return json.data ?? json;
    } catch (error) {
      console.error("Error fetching template:", error);
      throw error;
    }
  }

  async createTemplate(data: CreateTemplateDTO): Promise<TaskTemplateDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/templates`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data)
      });

      const json = await res.json().catch(() => ({}));

      if(!res.ok) {
        throw new Error(json?.message ?? "Failed to create template");
      }

      return json.data ?? json;
    }
    catch (error) {
      console.error("Error creating template: ", error);
      throw Error;
    }
  }
}
