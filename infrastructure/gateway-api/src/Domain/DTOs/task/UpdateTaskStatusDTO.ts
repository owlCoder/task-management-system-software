import { TaskStatus } from "../../enums/task/TaskStatus";

export interface UpdateTaskStatusDTO {
    status: TaskStatus,
    fileId? : number
}