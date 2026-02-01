export interface ProjectUserDTO {
    pu_id: number;
    project_id: number;
    user_id: number;
    weekly_hours: number;
    added_at: Date;
    username?:  string;
    role_name?: string;  
    image_url?: string;
}