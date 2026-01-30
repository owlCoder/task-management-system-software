export interface UserCreationDTO {
  username: string;
  role_name: string;
  password: string;
  email: string;
  image_key?: string;
  image_url?: string;
}