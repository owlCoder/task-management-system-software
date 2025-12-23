import { In, Repository } from "typeorm";
import { UserRole } from "../Domain/models/UserRole";
import { IUserRoleService } from "../Domain/services/IUserRoleService";
import { UserRoleDTO } from "../Domain/DTOs/UserRoleDTO";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";

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
        impact_level: r.impact_level,
      })),
    };
  }

  /**
   * Get user roles based on their impact level
   */
  async getUserRoleByImpactLevel(
    impact_level: number
  ): Promise<Result<UserRoleDTO[]>> {
    const roles = await this.userRoleRepository.find({
      where: { impact_level: impact_level },
    });

    if (roles.length > 0) {
      const userRoles: UserRoleDTO[] = roles.map((r) => ({
        user_role_id: r.user_role_id,
        role_name: r.role_name,
        impact_level: r.impact_level,
      }));

      return {
        success: true,
        data: userRoles,
      };
    } else {
      return {
        success: false,
        code: ErrorCode.INVALID_INPUT,
        error: `There is no user roles with IMPACT_LEVEL ${impact_level}`,
      };
    }
  }

  /**
   * Get roles for creation
   */

  async getUserRolesForUserCreation(): Promise<Result<UserRoleDTO[]>> {
    const roles = await this.userRoleRepository.find({
      where: {
        role_name: In([
          "Project Manager",
          "Audio & Music Stagist",
          "Animation Worker",
          "Analytics & Development Manager",
        ]),
      },
    });

    if (roles.length > 0) {
      const userRoles: UserRoleDTO[] = roles.map((r) => ({
        user_role_id: r.user_role_id,
        role_name: r.role_name,
        impact_level: r.impact_level,
      }));

      return {
        success: true,
        data: userRoles,
      };
    } else {
      return {
        success: false,
        code: ErrorCode.INTERNAL_ERROR,
        error: `There is error on server`,
      };
    }
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
