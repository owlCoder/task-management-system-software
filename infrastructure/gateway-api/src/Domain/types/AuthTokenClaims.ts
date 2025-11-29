import { UserRole } from "../enums/UserRole";

export type AuthTokenClaimsType = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
};
