import { TaskStatus } from "../enums/TaskStatus";

export interface UpdateTaskStatusDTO {
    status: TaskStatus;
    file_id?: number;
}