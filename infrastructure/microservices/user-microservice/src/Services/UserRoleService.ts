import { Repository } from "typeorm";
import { UserRole } from "../Domain/models/UserRole";
import { IUserRoleService } from "../Domain/services/IUserRoleService";
import { UserRoleDTO } from "../Domain/DTOs/UserRoleDTO";
import { Result } from "../Domain/types/Result";

export class UserRoleService implements IUserRoleService {
  constructor(private userRoleRepository: Repository<UserRole>) {}

  /**
   * Get all user roles
   */

  async getAllUserRoles(): Promise<Result<UserRoleDTO[]>> {
    const roles = await this.userRoleRepository.find();
    return {
      success: true,
      data: roles.map((r) => ({
        user_role_id: r.user_role_id,
        role_name: r.role_name,
      })),
    };
  }

  /**
   * Get role by role_name
   */

  async getRoleByRoleName(role_name: string): Promise<UserRoleDTO> {
    //posto dobijamo role_name:string onda pretrazujemo da li postoji taj role_name u bazi
    const userRole = await this.userRoleRepository.findOne({
      where: { role_name: role_name },
    });

    return new UserRoleDTO(userRole?.user_role_id, userRole?.role_name);
  }
}
