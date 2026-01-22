import { Result } from "../../types/Result";
import { CreateTaskFromTemplateDTO } from "../../DTOs/TaskCreateDTO";
import { TaskResponseDTO } from "../../DTOs/TaskResponseDTO";

export interface ITaskServiceClient {
    addTaskForSprint(
        sprint_id: number,
        createTaskDTO: CreateTaskFromTemplateDTO,
        user_id: number
    ): Promise<Result<TaskResponseDTO>>;
}