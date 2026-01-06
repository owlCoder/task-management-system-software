export interface UserDTO {
  user_id: number;
  username: string;
  role_name: string;
  email: string;
  weekly_working_hour_sum: number;
}

export const DefaultUser: UserDTO = {
  user_id: 0,
  username: "",
  role_name: "",
  email: "",
  weekly_working_hour_sum: 0,
};
