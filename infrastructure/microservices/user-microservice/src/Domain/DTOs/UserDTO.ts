export interface UserDTO {
  user_id: number;
  username: string;
  email: string;
  role_name: string;
  image_url: string;
  weekly_working_hour_sum: number;
}

export const DefaultUser: UserDTO = {
  user_id: 0,
  username: "",
  role_name: "",
  email: "",
  image_url: "",
  weekly_working_hour_sum: 0,
};