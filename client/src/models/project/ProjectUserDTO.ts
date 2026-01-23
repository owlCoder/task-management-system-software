export type ProjectUserDTO = {
    pu_id?: number;
    project_id: number;
    user_id: number;
    weekly_hours: number;
    username?:  string;     
    role_name?: string; 
    image_url?: string;//
};