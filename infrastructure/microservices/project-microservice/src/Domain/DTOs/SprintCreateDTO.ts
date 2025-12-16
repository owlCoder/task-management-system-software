export interface SprintCreateDTO {
    project_id: number;
    sprint_title: string;
    sprint_description: string;
    start_date: Date;
    end_date: Date;
}