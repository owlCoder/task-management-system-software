import { UserRoleDTO } from "../DTOs/UserRoleDTO";
import { Result } from "../types/Result";

export interface IUserRoleService {
  getAllUserRoles(): Promise<Result<UserRoleDTO[]>>;
  getUserRoleByImpactLevel(impact_level:number) : Promise<Result<UserRoleDTO[]>>;
}
