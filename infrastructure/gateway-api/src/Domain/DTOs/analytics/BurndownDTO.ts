import { BurndownTaskDTO } from "./BurndownTaskDTO";

export interface BurndownDTO {
    project_id: number;
    sprint_id: number;
    tasks: BurndownTaskDTO[];
}