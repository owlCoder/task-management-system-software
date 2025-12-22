import { BurndownTaskDTO } from "./BurndownTaskDto";

export interface BurndownDto {
    project_id: number;
    sprint_id: number;
    tasks: BurndownTaskDTO[];
}