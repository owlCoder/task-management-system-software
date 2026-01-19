export interface UserDTO {
  user_id: number;
  username: string;
  email: string;
  role_name: string;
  image_url?: string;
  weekly_working_hour_sum?: number;
}