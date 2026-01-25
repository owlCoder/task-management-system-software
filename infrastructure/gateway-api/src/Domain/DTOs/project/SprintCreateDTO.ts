export interface SprintCreateDTO {
    sprint_title: string;
    sprint_description: string;
    start_date: string | Date;
    end_date: string | Date;
    story_points?: number;
}