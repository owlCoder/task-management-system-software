import { BurnupPointDTO } from "./BurnupPointDTO";

export interface BurnupDTO {
    project_id: number;
    sprint_id: number;
    sprint_duration_date: number;
    work_amount: number;
    points: BurnupPointDTO[];
}