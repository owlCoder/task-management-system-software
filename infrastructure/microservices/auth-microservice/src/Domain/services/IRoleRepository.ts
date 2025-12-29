import { UserRole } from "../models/UserRole";

export interface IRoleRepository {
  find(): Promise<UserRole[]>;
}