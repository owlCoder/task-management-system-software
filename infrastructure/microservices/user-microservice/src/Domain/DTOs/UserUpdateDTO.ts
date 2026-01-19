export interface UserUpdateDTO {
  username: string;
  email: string;
  role_name: string;
  password?: string;
  image_key?: string;
  image_url?: string;
}