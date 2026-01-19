import { ITaskTemplateAPI } from "./ITaskTemplateAPI";
import { TaskTemplateDTO } from "../../models/task/TaskTemplateDTO";

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
}
