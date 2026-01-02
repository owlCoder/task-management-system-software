export interface SprintDTO {
    sprint_id: number;
    project_id: number;
    sprint_title: string;
    sprint_description: string;
    start_date: Date;
    end_date: Date;
    story_points: number;
}