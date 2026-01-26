import { TaskDTO } from "./types";

export interface ITaskServiceClient {
  getTasksBySprintIds(sprintIds: number[]): Promise<TaskDTO[]>;
}
