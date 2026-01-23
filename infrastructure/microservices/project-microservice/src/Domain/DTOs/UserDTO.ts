export interface UserDTO {
  user_id: number;
  username: string;
  role_name: string;
  email: string;
  weekly_working_hour_sum: number;
  image_url?: string; //
}