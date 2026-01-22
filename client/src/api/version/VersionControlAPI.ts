import axios, { AxiosError, AxiosInstance } from "axios";
import { IVersionControlAPI } from "./IVersionControlAPI";
import { TaskReviewDTO } from "../../models/version/TaskReviewDTO";
import { ReviewCommentDTO } from "../../models/version/ReviewCommentDTO";
import { readValueByKey } from "../../helpers/local_storage";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

class VersionControlAPIImpl implements IVersionControlAPI {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: GATEWAY_URL,
      timeout: 30000,
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

  async getTasksInReview(): Promise<TaskReviewDTO[]> {
    try {
      const response = await this.client.get<TaskReviewDTO[]>(`/reviews`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks in review:", error);
      throw error;
    }
  }

  async sendTaskToReview(taskId: number): Promise<TaskReviewDTO> {
    try {
      const response = await this.client.post<TaskReviewDTO>(
        `/reviews/${taskId}/send`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error sending task to review:", error);
      throw error;
    }
  }

  async approveTaskReview(taskId: number): Promise<TaskReviewDTO> {
    try {
      const response = await this.client.post<TaskReviewDTO>(
        `/reviews/${taskId}/accept`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error approving task review:", error);
      throw error;
    }
  }

  async rejectTaskReview(taskId: number, commentText: string): Promise<ReviewCommentDTO> {
    try {
      const response = await this.client.post<ReviewCommentDTO>(
        `/reviews/${taskId}/reject`,
        { commentText }
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting task review:", error);
      throw error;
    }
  }

  async getReviewHistoryByTaskId(taskId: number): Promise<(TaskReviewDTO | ReviewCommentDTO)[]> {
    try {
      const response = await this.client.get<(TaskReviewDTO | ReviewCommentDTO)[]>(
        `/reviews/${taskId}/history`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching review history by task ID:", error);
      throw error;
    }
  }
}

export const VersionControlAPI: IVersionControlAPI = new VersionControlAPIImpl();
