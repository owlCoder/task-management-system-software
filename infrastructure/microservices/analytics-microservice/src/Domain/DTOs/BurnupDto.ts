import { BurnupPointDto } from "./BurnupPointDto";

export interface BurnupDto {
    project_id: number;
    sprint_id: number;
    sprint_duration_date: number; //x-axis
    work_amount: number; //y-axis
    points: BurnupPointDto[];
}