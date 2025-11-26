import { UserRoleDTO } from "../DTOs/UserRoleDTO";

export interface IUserRoleService {
  getAllUserRoles(): Promise<UserRoleDTO[]>;
}
