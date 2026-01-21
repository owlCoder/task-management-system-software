import axios, {AxiosInstance} from "axios";
import { ITaskServiceClient } from "../../Domain/services/external-services/ITaskServiceClient";
import { Result } from "../../Domain/types/Result";
import { ErrorCode } from "../../Domain/enums/ErrorCode";
import { CreateTaskFromTemplateDTO } from "../../Domain/DTOs/TaskCreateDTO";
import { TaskResponseDTO } from "../../Domain/DTOs/TaskResponseDTO";

export class TaskServiceClient implements ITaskServiceClient{
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string = process.env.TASK_SERVICE_API || 'http://localhost:12234/api/v1') {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 5000
        });

    }

    async addTaskForSprint(sprintId: number, createTaskDTO: CreateTaskFromTemplateDTO, user_id: number): Promise<Result<TaskResponseDTO>> {
    try {
        const response = await this.axiosInstance.post(`/tasks/sprints/${sprintId}`, createTaskDTO, {
            headers: {
                'x-user-id': user_id.toString()
            }
        });

        return { success: true, data: response.data }; 
    } catch (error: any) {

        if (error.response?.status === 404) {
            return { success: false, code: ErrorCode.NOT_FOUND, error: "Sprint not found" };
        }
        
        const errorMessage = error.response?.data?.message || "Failed to create task";
        return { success: false, code: ErrorCode.INTERNAL_ERROR, error: errorMessage };
    }
}
}
