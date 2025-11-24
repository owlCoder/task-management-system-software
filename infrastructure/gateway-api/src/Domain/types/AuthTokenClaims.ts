import { UserRole } from "../enums/UserRole";

export type AuthTokenClaimsType = {
  id: number;
  username: string;
  role: UserRole;
  token: string;
};
