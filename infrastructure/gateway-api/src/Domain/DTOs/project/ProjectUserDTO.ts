export interface ProjectUserDTO {
    pu_id: number;
    project_id: number;
    user_id: number;
    added_at: Date;
    weekly_hours: number;
    username?:  string;
    role_name?: string; 
    image_url?: string;
}