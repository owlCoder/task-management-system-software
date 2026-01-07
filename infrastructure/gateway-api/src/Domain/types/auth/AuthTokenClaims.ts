import { UserRole } from "../../enums/user/UserRole";

export type AuthTokenClaimsType = {
  	id: number;
  	username: string;
  	email: string;
  	role: UserRole;
};
