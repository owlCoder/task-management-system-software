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
            const formData = new FormData();

            formData.append("project_name", data.project_name);
            formData.append("project_description", data.project_description || "");
            formData.append("total_weekly_hours_required", data.total_weekly_hours_required.toString());
            formData.append("allowed_budget", data.allowed_budget.toString());
            formData.append("sprint_count", data.sprint_count.toString());
            formData.append("sprint_duration", data.sprint_duration.toString());
            formData.append("status", data.status);

            if (data.start_date) {
                formData.append("start_date", data.start_date);
            }

            if (data.user_id) {
                formData.append("user_id", data.user_id.toString());
            }

            if (data.image_file) {
                formData.append("image_file", data.image_file);
            }

            const response = await this.client.post<ProjectDTO>("/projects", formData);
            return response.data;
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    }

    async updateProject(projectId: number, data: ProjectUpdateDTO): Promise<ProjectDTO | null> {
        try {
            const formData = new FormData();

            if (data.project_name !== undefined) {
                formData.append("project_name", data.project_name);
            }
            if (data.project_description !== undefined) {
                formData.append("project_description", data.project_description);
            }
            if (data.total_weekly_hours_required !== undefined) {
                formData.append("total_weekly_hours_required", data.total_weekly_hours_required.toString());
            }
            if (data.allowed_budget !== undefined) {
                formData.append("allowed_budget", data.allowed_budget.toString());
            }
            if (data.sprint_count !== undefined) {
                formData.append("sprint_count", data.sprint_count.toString());
            }
            if (data.sprint_duration !== undefined) {
                formData.append("sprint_duration", data.sprint_duration.toString());
            }
            if (data.status !== undefined) {
                formData.append("status", data.status);
            }
            if (data.start_date !== undefined) {
                formData.append("start_date", data.start_date || "");
            }
            if (data.image_file) {
                formData.append("image_file", data.image_file);
            }

            const response = await this.client.put<ProjectDTO>(`/projects/${projectId}`, formData);
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
