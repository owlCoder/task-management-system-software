export type AuthTokenClaims = {
  user_id: number;
  username: string;
  email: string;
  role: string;
  image_url?: string;
};
