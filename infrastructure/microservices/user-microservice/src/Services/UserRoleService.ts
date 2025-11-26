import { Repository } from "typeorm";
import { UserRole } from "../Domain/models/UserRole";
import { IUserRoleService } from "../Domain/services/IUserRoleService";
import { UserRoleDTO } from "../Domain/DTOs/UserRoleDTO";

export class UserRoleService implements IUserRoleService {
  constructor(private userRoleRepository: Repository<UserRole>) {}

  /**
   * Get all user roles
   */

  async getAllUserRoles(): Promise<UserRoleDTO[]> {
    const roles = await this.userRoleRepository.find();
    return roles.map((r) => ({
      user_role_id: r.user_role_id,
      role_name: r.role_name,
    }));
  }
}
